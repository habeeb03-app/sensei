import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCorrection } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { getToday } from "@/lib/utils";
import { updateUserActivity } from "@/lib/user";

export async function POST(req: NextRequest) {
  console.log("=== Writing API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("[writing] Aborting — GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const correction = await generateCorrection(text);

    await connectDB();
    const today = getToday();

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { writingScore: 1, xpEarned: 15 },
        $addToSet: { activitiesCompleted: "writing" },
      },
      { upsert: true }
    );

    await updateUserActivity(session.user.id, 15);

    return NextResponse.json(correction);
  } catch (error) {
    console.error("[writing] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
