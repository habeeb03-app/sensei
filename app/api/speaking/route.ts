import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { evaluateSpeaking } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  console.log("=== Speaking API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const evaluation = await evaluateSpeaking(transcript);
    const score = Math.round(evaluation.score || 0);

    await connectDB();
    const today = new Date().toISOString().split("T")[0];

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { speakingScore: score, xpEarned: 20 },
        $push: { activitiesCompleted: "speaking" },
      },
      { upsert: true }
    );

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: 20 },
    });

    return NextResponse.json({
      score,
      feedback: evaluation.feedback,
      improved: evaluation.improved,
    });
  } catch (error) {
    console.error("Speaking API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
