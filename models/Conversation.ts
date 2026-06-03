import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  corrections?: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: string;
  mode: "free" | "scenario" | "interview";
  scenario?: string;
  messages: IMessage[];
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
  corrections: String,
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: String, required: true, index: true },
    mode: { type: String, enum: ["free", "scenario", "interview"], default: "free" },
    scenario: String,
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
