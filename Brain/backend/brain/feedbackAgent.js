import { retrieve }            from './ragEngine.js';
import { buildFeedbackPrompt } from './promptTemplates.js';
import { parseFeedbackResponse } from './outputParser.js';
import { callLLM }             from '../services/llmService.js';

export async function run({ question, studentAnswer, correctAnswer, method, studentPreferences }) {
  const rag    = retrieve(`${method} ${question}`);
  const prompt = buildFeedbackPrompt(studentPreferences, rag);
  const raw    = await callLLM({
    systemPrompt: prompt,
    userMessage: JSON.stringify({ question, student_answer: studentAnswer, correct_answer: correctAnswer, method }),
    temperature: 0.3,
  });
  return parseFeedbackResponse(raw);
}
