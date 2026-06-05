import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCorrection } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  console.log("=== Writing API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const correction = await generateCorrection(text);

    await connectDB();
    const today = new Date().toISOString().split("T")[0];

    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { writingScore: 1, xpEarned: 15 },
        $push: { activitiesCompleted: "writing" },
      },
      { upsert: true }
    );

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: 15 },
    });

    return NextResponse.json(correction);
  } catch (error) {
    console.error("[writing] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
