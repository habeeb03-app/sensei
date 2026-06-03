import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateVocabulary } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const words = await generateVocabulary(user.level);
    return NextResponse.json(words);
  } catch (error) {
    console.error("Vocabulary API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quizScore } = await req.json();

    await connectDB();
    const today = new Date().toISOString().split("T")[0];

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { vocabularyLearned: 1, xpEarned: 25 },
        $push: { activitiesCompleted: "vocabulary_quiz" },
      },
      { upsert: true }
    );

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: 25 },
    });

    return NextResponse.json({ success: true, xpEarned: 25 });
  } catch (error) {
    console.error("Vocabulary quiz API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
