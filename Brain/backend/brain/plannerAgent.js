import { retrieve }           from './ragEngine.js';
import { buildPlannerPrompt } from './promptTemplates.js';
import { parsePlannerResponse } from './outputParser.js';
import { callLLM }            from '../services/llmService.js';

export async function run({ concept, studentPreferences }) {
  const rag    = retrieve(concept);
  const prompt = buildPlannerPrompt(studentPreferences, rag);
  const raw    = await callLLM({ systemPrompt: prompt, userMessage: `Create a learning plan for: ${concept}`, temperature: 0 });
  return parsePlannerResponse(raw);
}
