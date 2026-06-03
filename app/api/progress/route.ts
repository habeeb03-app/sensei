import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";
import User from "@/models/User";
import { getLevel, getLevelProgress } from "@/lib/utils";

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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateStr = thirtyDaysAgo.toISOString().split("T")[0];

    const progressRecords = await Progress.find({
      userId: session.user.id,
      date: { $gte: dateStr },
    }).sort({ date: 1 });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        level: getLevel(user.xp),
        levelProgress: getLevelProgress(user.xp),
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
      },
      progress: progressRecords,
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
