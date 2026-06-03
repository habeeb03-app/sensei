import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  level: "beginner" | "intermediate" | "advanced" | "fluent";
  xp: number;
  streak: number;
  lastActiveDate: Date;
  badges: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced", "fluent"], default: "beginner" },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    badges: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
