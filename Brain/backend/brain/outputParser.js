import { z } from 'zod';

const OutOfScope = z.object({ error: z.literal('out_of_scope'), message: z.string() });

const Step = z.object({
  id: z.number(),
  type: z.enum(['show', 'highlight', 'calculate', 'cross', 'multiply', 'combine']),
  expression: z.string(),
  value: z.union([z.number(), z.string()]),
  explanation: z.string(),
});

const TutorSchema = z.object({
  method: z.string(),
  steps: z.array(Step).min(1),
  final_answer: z.string(),
});

const PlannerSchema = z.object({
  concept: z.string(),
  total_phases: z.number(),
  plan: z.array(z.object({
    phase: z.number(),
    name: z.string(),
    goal: z.string(),
    explanation_points: z.array(z.string()),
    analogy: z.string().nullable(),
    example: z.string().nullable(),
  })),
  readiness_check: z.object({
    question: z.string(),
    expected_answer: z.union([z.string(), z.number()]),
  }),
});

const PracticeSchema = z.object({
  topic: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  questions: z.array(z.object({
    id: z.number(),
    question: z.string(),
    expected_answer: z.number().int(),
  })).min(1),
});

const FeedbackSchema = z.object({
  question: z.string(),
  student_answer: z.union([z.string(), z.number()]),
  correct_answer: z.union([z.string(), z.number()]),
  error_type: z.string(),
  diagnosis: z.string(),
  correction: z.object({
    step_id: z.union([z.string(), z.number()]),
    step_description: z.string(),
    student_value: z.union([z.string(), z.number()]),
    correct_value: z.union([z.string(), z.number()]),
    explanation: z.string(),
  }),
  encouragement: z.string(),
  follow_up: z.object({ question: z.string(), hint: z.string() }),
});

function parseRaw(raw) {
  // Strip markdown code fences
  let cleaned = raw.replace(/^```(?:json)?\n?|```$/gm, '').trim();
  // Extract first JSON object or array if there's surrounding text
  const match = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (match) cleaned = match[1];
  try { return JSON.parse(cleaned); }
  catch { throw new Error(`LLM returned non-JSON: ${raw.slice(0, 500)}`); }
}

function parse(raw, schema) {
  const data = parseRaw(raw);
  const oos = OutOfScope.safeParse(data);
  if (oos.success) return { out_of_scope: true, ...oos.data };
  return schema.parse(data);
}

export const parseTutorResponse    = raw => parse(raw, TutorSchema);
export const parsePlannerResponse  = raw => parse(raw, PlannerSchema);
export const parsePracticeResponse = raw => parse(raw, PracticeSchema);
export const parseFeedbackResponse = raw => parse(raw, FeedbackSchema);
