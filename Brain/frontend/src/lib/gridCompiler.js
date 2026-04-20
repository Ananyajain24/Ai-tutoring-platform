import { simulateUrdhva }   from './simulators/urdhva.js';
import { simulateNikhilam } from './simulators/nikhilam.js';

const MUL_RE = /(\d+)\s*[×x*]\s*(\d+)/;
const SQR_RE = /(\d+)\s*[²^]|(\d+)\s*\^?\s*2\b/;

function extractNumbers(text) {
  const mul = text?.match(MUL_RE);
  if (mul) return [parseInt(mul[1]), parseInt(mul[2])];
  const sqr = text?.match(SQR_RE);
  if (sqr) { const n = parseInt(sqr[1] ?? sqr[2]); return [n, n]; }
  return null;
}

/**
 * Parses the problem expression and dispatches to the right simulator.
 * Accepts an optional raw `problem` string (user's original input) as a
 * second parameter so parsing doesn't depend solely on LLM-formatted steps.
 */
export function compileGrid(result, problem = '') {
  const method = (result.method ?? '').toLowerCase();

  // 1. Try the raw problem string the user typed
  let nums = extractNumbers(problem);

  // 2. Scan every step's expression field
  if (!nums) {
    for (const step of (result.steps ?? [])) {
      nums = extractNumbers(step.expression);
      if (nums) break;
    }
  }

  // 3. Try final_answer context — last resort: pull two numbers from problem
  if (!nums) {
    const allNums = problem.match(/\d+/g);
    if (allNums?.length >= 2) nums = [parseInt(allNums[0]), parseInt(allNums[1])];
  }

  if (!nums) return fallback(result);

  const [a, b] = nums;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return fallback(result);

  if (method.includes('nikhilam')) return simulateNikhilam(a, b);
  return simulateUrdhva(a, b);
}

function fallback(result) {
  return {
    actions: [
      { type: 'speak', text: `The answer is ${result.final_answer}.` },
      { type: 'show_answer', value: result.final_answer },
    ],
    meta: { rows: 1, cols: String(result.final_answer ?? '0').length, unitCol: String(result.final_answer ?? '0').length - 1 },
  };
}
