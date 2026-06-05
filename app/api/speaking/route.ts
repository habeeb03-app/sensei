import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evaluateSpeaking } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { getToday, getYesterday } from "@/lib/utils";

export async function POST(req: NextRequest) {
  console.log("=== Speaking API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("[speaking] Aborting — GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const evaluation = await evaluateSpeaking(transcript);
    const score = Math.round(evaluation.score || 0);

    await connectDB();
    const today = getToday();

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { speakingScore: score, xpEarned: 20 },
        $addToSet: { activitiesCompleted: "speaking" },
      },
      { upsert: true }
    );

    const user = await User.findById(session.user.id);
    if (user) {
      const lastActive = user.lastActiveDate
        ? new Date(user.lastActiveDate).toISOString().split("T")[0]
        : null;
      const newStreak = lastActive === today ? user.streak
        : lastActive === getYesterday() ? user.streak + 1
        : 1;

      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: 20 },
        $set: { lastActiveDate: new Date(), streak: newStreak },
      });
    }

    return NextResponse.json({
      score,
      feedback: evaluation.feedback,
      improved: evaluation.improved,
    });
  } catch (error) {
    console.error("[speaking] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
