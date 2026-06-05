import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("[gemini] MISSING ENV VAR: GEMINI_API_KEY — all AI features will fail");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");

export const MODEL = "gemini-2.5-flash";

function cleanJsonResponse(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const firstBracket = trimmed.indexOf("[");
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    const lastBrace = trimmed.lastIndexOf("}");
    if (lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);
  }
  if (firstBracket !== -1) {
    const lastBracket = trimmed.lastIndexOf("]");
    if (lastBracket > firstBracket) return trimmed.slice(firstBracket, lastBracket + 1);
  }
  return trimmed;
}

export interface StreamChatParams {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  mode?: "free" | "scenario" | "interview";
  scenario?: string;
}

export function buildPartnerSystemPrompt(mode: string, scenario?: string): string {
  const base = "You are Sensei, a friendly AI English conversation partner. Your role is to help the user practice English in a natural, supportive way. Follow these rules:\n1. Speak in natural, conversational English\n2. Keep responses concise (2-4 sentences normally)\n3. If the user makes a grammar mistake, gently model the correct usage in your response\n4. Encourage the user to keep talking\n5. Adapt your language complexity to the user's level\n";

  const modeInstructions: Record<string, string> = {
    free: "Have a natural, free-flowing conversation. Ask the user questions about their day, interests, or opinions to keep the conversation going.",
    scenario: `Role-play the following scenario as a character the user would interact with: ${scenario || "Restaurant"}. Stay in character and help the user practice real-world English.`,
    interview: "Act as a job interviewer. Ask the user common interview questions, give feedback on their answers, and help them improve their interview English.",
  };

  return base + (modeInstructions[mode] || modeInstructions.free);
}

function getJsonModel(systemInstruction: string) {
  return genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
  });
}

function toGeminiContents(messages: { role: string; content: string }[]) {
  return messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));
}

export async function createPartnerStream(params: StreamChatParams) {
  const systemPrompt = buildPartnerSystemPrompt(params.mode || "free", params.scenario);

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const contents = toGeminiContents(params.messages);
  return model.generateContentStream({ contents });
}

export async function generateCorrection(text: string) {
  const model = getJsonModel(
    "You are an English grammar expert. Analyze the given text and return a JSON object with: 'corrected' (the corrected version), 'explanation' (brief explanation of errors), and 'improved' (an enhanced version with better vocabulary). Keep explanations concise."
  );

  const result = await model.generateContent(text);
  const responseText = cleanJsonResponse(result.response.text());
  return JSON.parse(responseText);
}

export async function evaluateSpeaking(transcript: string) {
  const model = getJsonModel(
    "You are an English speaking evaluator. Analyze the transcribed speech and return a JSON object with: 'score' (0-100), 'feedback' (constructive feedback on grammar, vocabulary, and fluency), and 'improved' (an improved version of what the user said). Be encouraging and specific."
  );

  const result = await model.generateContent(transcript);
  const responseText = cleanJsonResponse(result.response.text());
  return JSON.parse(responseText);
}

export async function generateVocabulary(level: string) {
  const model = getJsonModel(
    `Generate 10 English vocabulary words suitable for a ${level} learner. Return a JSON array of objects, each with: 'word', 'meaning' (simple definition), 'example' (example sentence), 'level' (the level). Make examples practical and everyday.`
  );

  const result = await model.generateContent(`Generate vocabulary for ${level} level.`);
  const responseText = cleanJsonResponse(result.response.text());
  return JSON.parse(responseText);
}

export async function generateListeningContent(level: string) {
  const model = getJsonModel(
    `Generate a short English listening passage (3-4 sentences) suitable for a ${level} learner, followed by 5 multiple-choice questions. Return a JSON object with: 'passage' (the text), 'questions' (array of {question, options: string[], correctIndex: number, explanation: string}). Make the passage conversational and practical.`
  );

  const result = await model.generateContent(`Generate listening content for ${level} level.`);
  const responseText = cleanJsonResponse(result.response.text());
  return JSON.parse(responseText);
}
