import User from "@/models/User";
import { getToday, getYesterday } from "@/lib/utils";

export async function updateUserActivity(userId: string, xpAmount: number) {
  const today = getToday();
  const user = await User.findById(userId);
  if (!user) return;

  const lastActive = user.lastActiveDate
    ? new Date(user.lastActiveDate).toISOString().split("T")[0]
    : null;
    
  let newStreak = user.streak;
  if (lastActive === getYesterday()) {
    newStreak = user.streak + 1;
  } else if (lastActive !== today) {
    newStreak = 1;
  } else if (lastActive === today && user.streak === 0) {
    newStreak = 1;
  }

  await User.findByIdAndUpdate(userId, {
    $inc: { xp: xpAmount },
    $set: { lastActiveDate: new Date(), streak: newStreak },
  });
}
