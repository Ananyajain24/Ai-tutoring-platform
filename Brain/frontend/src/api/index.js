const DEFAULT_PREFS = {
  student_id: 'default',
  name: 'Student',
  preferences: {
    interests: ['cricket'],
    explanation_style: 'visual',
    difficulty_level: 'beginner',
    language: 'English',
  },
  performance: {
    strong_topics: [],
    weak_topics: [],
    last_score: null,
  },
};

const BASE = 'http://localhost:4000';

async function post(path, body) {
  const res = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'API error');
  }
  return res.json();
}

export const solveProblem = (problem) =>
  post('/tutor', { problem, studentPreferences: DEFAULT_PREFS });

export const generatePractice = (topic, difficulty, count = 5) =>
  post('/practice', { topic, difficulty, count, studentPreferences: DEFAULT_PREFS });

export const evaluate = (studentAnswer, expectedAnswer) =>
  post('/evaluate', { studentAnswer, expectedAnswer });

export const getFeedback = (question, studentAnswer, correctAnswer, method) =>
  post('/feedback', { question, studentAnswer, correctAnswer, method, studentPreferences: DEFAULT_PREFS });

export const getPlan = (concept) =>
  post('/plan', { concept, studentPreferences: DEFAULT_PREFS });
