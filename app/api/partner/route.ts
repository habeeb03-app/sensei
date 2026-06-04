import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPartnerStream } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(req: NextRequest) {
  console.log("=== Partner API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { message, mode, scenario, conversationId } = await req.json();

    if (!message) {
      return new Response("Message is required", { status: 400 });
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

          controller.close();
        } catch (error) {
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
    console.error("Partner API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
