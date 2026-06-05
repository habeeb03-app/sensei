import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateListeningContent } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";
import { getToday, getLevel } from "@/lib/utils";
import { updateUserActivity } from "@/lib/user";

export async function GET() {
  console.log("=== Listening API ===");
  const session = await getServerSession(authOptions);
  console.log("Session:", !!session, "UserId:", session?.user?.id);
  console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const content = await generateListeningContent(getLevel(user.xp));

    // Track listening activity (award XP for completion)
    const today = getToday();
    await Progress.findOneAndUpdate(
      { userId: session.user.id, date: today },
      {
        $inc: { xpEarned: 10 },
        $addToSet: { activitiesCompleted: "listening" },
      },
      { upsert: true }
    );

    await updateUserActivity(session.user.id, 10);

    return NextResponse.json(content);
  } catch (error) {
    console.error("[listening] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
