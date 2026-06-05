import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateVocabulary } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";
import { getToday, getLevel } from "@/lib/utils";
import { updateUserActivity } from "@/lib/user";

export async function GET() {
  console.log("=== Vocabulary GET API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("[vocabulary] Aborting — GEMINI_API_KEY is not set");
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const words = await generateVocabulary(getLevel(user.xp));
    return NextResponse.json({ words });
  } catch (error) {
    console.error("[vocabulary] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  console.log("=== Vocabulary POST API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizScore } = await req.json();

    await connectDB();
    const today = getToday();

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { vocabularyLearned: quizScore || 0, xpEarned: 25 },
        $addToSet: { activitiesCompleted: "vocabulary_quiz" },
      },
      { upsert: true }
    );

    await updateUserActivity(session.user.id, 25);

    return NextResponse.json({ success: true, xpEarned: 25 });
  } catch (error) {
    console.error("[vocabulary] POST Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
