import { retrieve }            from './ragEngine.js';
import { buildPracticePrompt } from './promptTemplates.js';
import { parsePracticeResponse } from './outputParser.js';
import { callLLM }             from '../services/llmService.js';

export async function run({ topic, difficulty, count = 5, studentPreferences }) {
  const rag    = retrieve(topic);
  const prompt = buildPracticePrompt(studentPreferences, rag);
  const raw    = await callLLM({ systemPrompt: prompt, userMessage: JSON.stringify({ topic, difficulty, count }), temperature: 0 });
  return parsePracticeResponse(raw);
}
