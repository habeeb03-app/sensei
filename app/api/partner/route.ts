import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPartnerStream } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { getToday } from "@/lib/utils";
import { updateUserActivity } from "@/lib/user";

function checkEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`[partner] MISSING ENV VAR: ${name}`);
  }
  return value || "";
}

export async function POST(req: NextRequest) {
  console.log("=== Partner API ===");

  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const geminiKey = checkEnv("GEMINI_API_KEY");
  const mongoUri = checkEnv("MONGODB_URI");
  console.log("[partner] GEMINI_API_KEY present:", !!geminiKey);
  console.log("[partner] MONGODB_URI present:", !!mongoUri);

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    const { message, mode, scenario, conversationId } = body;

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    if (!geminiKey) {
      console.error("[partner] Aborting — GEMINI_API_KEY is not set");
      return new Response("GEMINI_API_KEY is not configured on the server", { status: 500 });
    }

    await connectDB();

    let conversation;
    let isNew = false;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return new Response("Conversation not found", { status: 404 });
      }
    } else {
      isNew = true;
      conversation = await Conversation.create({
        userId: session.user.id,
        mode: mode || "free",
        scenario: scenario || null,
        messages: [],
      });
    }

    conversation.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    const messagesForAI = conversation.messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    console.log("[partner] Calling createPartnerStream...");
    const stream = await createPartnerStream({
      messages: messagesForAI,
      mode: mode || conversation.mode,
      scenario: scenario || conversation.scenario,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream.stream) {
            const content = chunk.text();
            if (content) {
              fullResponse += content;
              controller.enqueue(encoder.encode(content));
            }
          }

          conversation.messages.push({
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
          });
          await conversation.save();

          try {
            const today = getToday();
            await Progress.findOneAndUpdate(
              { userId: session.user.id, date: today },
              {
                $inc: { xpEarned: 5 },
                $addToSet: { activitiesCompleted: "partner_chat" },
              },
              { upsert: true }
            );

            await updateUserActivity(session.user.id, 5);
          } catch (e) {
            console.error("[partner] Progress update error:", e);
          }

          controller.close();
        } catch (error) {
          console.error("[partner] Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Conversation-Id": conversation._id.toString(),
        "X-Is-New": isNew ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("[partner] Handler error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(message, { status: 500 });
  }
}
