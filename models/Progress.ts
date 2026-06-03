import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: string;
  date: string;
  speakingScore: number;
  writingScore: number;
  vocabularyLearned: number;
  xpEarned: number;
  activitiesCompleted: string[];
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    speakingScore: { type: Number, default: 0 },
    writingScore: { type: Number, default: 0 },
    vocabularyLearned: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    activitiesCompleted: [{ type: String }],
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
