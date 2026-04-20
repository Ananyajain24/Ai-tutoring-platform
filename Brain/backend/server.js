import 'dotenv/config';
import express from 'express';
import * as tutorAgent    from './brain/tutorAgent.js';
import * as plannerAgent  from './brain/plannerAgent.js';
import * as practiceAgent from './brain/practiceAgent.js';
import * as feedbackAgent from './brain/feedbackAgent.js';
import { evaluate }       from './services/evaluationService.js';

const app = express();
app.use(express.json());

// Allow requests from the Vite dev server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Quick connectivity test — hit this first to verify LLM works
app.get('/api/test', async (req, res) => {
  try {
    const { callLLM } = await import('./services/llmService.js');
    const text = await callLLM({
      systemPrompt: 'You are a helpful assistant. Reply only with valid JSON.',
      userMessage: 'Reply with: {"status": "ok"}',
      temperature: 0,
    });
    res.json({ raw: text });
  } catch (err) {
    console.error('[TEST ERROR]', err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

function fail(res, err) {
  console.error('[ERROR]', err);
  res.status(500).json({ message: err.message, stack: err.stack });
}

app.post('/api/tutor', async (req, res) => {
  const { problem, studentPreferences } = req.body;
  if (!problem) return res.status(400).json({ message: 'problem is required' });
  try {
    res.json(await tutorAgent.run({ problem, studentPreferences }));
  } catch (err) { fail(res, err); }
});

app.post('/api/plan', async (req, res) => {
  const { concept, studentPreferences } = req.body;
  if (!concept) return res.status(400).json({ message: 'concept is required' });
  try {
    res.json(await plannerAgent.run({ concept, studentPreferences }));
  } catch (err) { fail(res, err); }
});

app.post('/api/practice', async (req, res) => {
  const { topic, difficulty, count, studentPreferences } = req.body;
  if (!topic || !difficulty) return res.status(400).json({ message: 'topic and difficulty are required' });
  try {
    res.json(await practiceAgent.run({ topic, difficulty, count, studentPreferences }));
  } catch (err) { fail(res, err); }
});

app.post('/api/evaluate', (req, res) => {
  const { studentAnswer, expectedAnswer } = req.body;
  if (studentAnswer === undefined || expectedAnswer === undefined)
    return res.status(400).json({ message: 'studentAnswer and expectedAnswer are required' });
  res.json(evaluate({ studentAnswer, expectedAnswer }));
});

app.post('/api/feedback', async (req, res) => {
  const { question, studentAnswer, correctAnswer, method, studentPreferences } = req.body;
  if (!question || studentAnswer === undefined || !correctAnswer || !method)
    return res.status(400).json({ message: 'question, studentAnswer, correctAnswer, method are required' });
  try {
    res.json(await feedbackAgent.run({ question, studentAnswer, correctAnswer, method, studentPreferences }));
  } catch (err) { fail(res, err); }
});

process.on('uncaughtException', (err) => console.error('[CRASH uncaughtException]', err));
process.on('unhandledRejection', (err) => console.error('[CRASH unhandledRejection]', err));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Brain backend running on http://localhost:${PORT}`));
server.on('error', (err) => console.error('[LISTEN ERROR]', err));
