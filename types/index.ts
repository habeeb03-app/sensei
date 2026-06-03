export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  corrections?: string;
  timestamp?: Date;
}

export type Mode = "free" | "scenario" | "interview";
export type Scenario = "restaurant" | "travel" | "interview" | "college";
export type Level = "beginner" | "intermediate" | "advanced" | "fluent";

export interface Word {
  word: string;
  meaning: string;
  example: string;
  level: Level;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ListeningQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CorrectionResult {
  corrected: string;
  explanation: string;
  improved: string;
}

export interface SpeakingEvaluation {
  score: number;
  feedback: string;
  improved: string;
}

export interface DailyProgress {
  date: string;
  speakingScore: number;
  writingScore: number;
  vocabularyLearned: number;
  xpEarned: number;
  activitiesCompleted: string[];
}

export interface UserData {
  name: string;
  email: string;
  level: Level;
  xp: number;
  streak: number;
  badges: string[];
}
