import { retrieve }         from './ragEngine.js';
import { buildTutorPrompt } from './promptTemplates.js';
import { parseTutorResponse } from './outputParser.js';
import { callLLM }          from '../services/llmService.js';

export async function run({ problem, studentPreferences }) {
  const rag    = retrieve(problem);
  const prompt = buildTutorPrompt(studentPreferences, rag);
  const raw    = await callLLM({ systemPrompt: prompt, userMessage: `Solve: ${problem}`, temperature: 0 });
  console.log('[tutor raw]', raw);
  return parseTutorResponse(raw);
}
