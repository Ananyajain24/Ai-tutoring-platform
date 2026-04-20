import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname = Brain/backend/brain  →  ../.. = Brain/
const ROOT = join(__dirname, '../..');

const read = (rel) => readFileSync(join(ROOT, rel), 'utf-8');

const SYSTEM_RULES = read('context/system-rules.md');
const AGENTS = {
  tutor:    read('.claude/commands/tutor-agent.md'),
  planner:  read('.claude/commands/planner-agent.md'),
  practice: read('.claude/commands/practice-agent.md'),
  feedback: read('.claude/commands/feedback-agent.md'),
};

function build(key, prefs, rag) {
  return [
    SYSTEM_RULES,
    AGENTS[key],
    `## Active Student Profile\n${JSON.stringify(prefs, null, 2)}`,
    `## Retrieved Knowledge\n${rag}`,
  ].join('\n\n');
}

export const buildTutorPrompt    = (p, r) => build('tutor',    p, r);
export const buildPlannerPrompt  = (p, r) => build('planner',  p, r);
export const buildPracticePrompt = (p, r) => build('practice', p, r);
export const buildFeedbackPrompt = (p, r) => build('feedback', p, r);
