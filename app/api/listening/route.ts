import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateListeningContent } from "@/lib/gemini";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

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

    const content = await generateListeningContent(user.level);
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
