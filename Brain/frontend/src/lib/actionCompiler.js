/**
 * Compiler: tutorResult → flat action sequence
 *
 * Action types:
 *   move_cursor  { lineIdx, charIdx }          — move pen before writing
 *   write_line   { text, color, lineIdx }      — typewriter a line
 *   gesture      { kind, ... }                 — SVG annotation (see GestureOverlay)
 *   speak        { text }                      — voice, awaits onend
 *   ask          { question, answer, hint }    — pause + student input
 *   pause        { ms }
 *   separator    {}
 *   show_answer  { value }
 */

// ── Layout constants (must stay in sync with Whiteboard.css) ────────────────
export const LINE_H = 34;   // px: line-height + gap
export const CHAR_W = 10.2; // px: JetBrains Mono 17px monospace
export const PAD_L  = 28;   // px: .wb-board padding-left
export const PAD_T  = 24;   // px: .wb-board padding-top

export function lineY(idx)          { return PAD_T + idx * LINE_H + LINE_H / 2; }
export function lineX(charIdx = 0)  { return PAD_L + charIdx * CHAR_W; }

// ── Step → color ─────────────────────────────────────────────────────────────
const COLOR = {
  show:      '#94a3b8',
  highlight: '#fbbf24',
  calculate: '#34d399',
  multiply:  '#c084fc',
  cross:     '#f472b6',
  combine:   '#60a5fa',
};

function fmt(step) {
  const v = step.value !== undefined && step.value !== '' ? step.value : null;
  return v !== null ? `${step.expression}  =  ${v}` : step.expression;
}

// ── Interaction heuristic ─────────────────────────────────────────────────────
// Ask ONE student question — the first highlight step with a numeric value.
function makeAsk(step) {
  const ans = String(step.value).trim();
  if (!ans || isNaN(Number(ans))) return null;
  return {
    type: 'ask',
    question: `What is ${step.expression}?`,
    answer: ans,
    hint: `Hint: ${step.explanation}`,
  };
}

// ── Main compiler ─────────────────────────────────────────────────────────────
export function compile(result) {
  const actions = [];
  let lineIdx   = 0;   // tracks how many lines have been written
  let askedOnce = false;

  // ── Intro ──────────────────────────────────────────────────────────────────
  actions.push({ type: 'speak', text: `Great. Let me solve this step by step using ${result.method}.` });
  actions.push({ type: 'pause', ms: 500 });

  // ── Per-step ───────────────────────────────────────────────────────────────
  for (const step of result.steps) {
    const text  = fmt(step);
    const color = COLOR[step.type] ?? '#e2e8f0';
    const idx   = lineIdx; // capture current line index for this step

    // Separator before combine
    if (step.type === 'combine') {
      actions.push({ type: 'separator' });
      actions.push({ type: 'pause', ms: 350 });
    }

    // Move cursor to line start
    actions.push({ type: 'move_cursor', lineIdx: idx, charIdx: 0 });
    actions.push({ type: 'pause', ms: 380 });

    // Write the line
    actions.push({ type: 'write_line', text, color, lineIdx: idx });
    lineIdx++;

    // Gesture: underline for calculate/multiply, circle for highlight
    if (step.type === 'highlight') {
      actions.push({
        type: 'gesture',
        kind: 'circle',
        lineIdx: idx,
        textLen: text.length,
        color: '#fbbf24',
      });
    } else if (step.type === 'calculate' || step.type === 'multiply') {
      actions.push({
        type: 'gesture',
        kind: 'underline',
        lineIdx: idx,
        textLen: text.length,
        color,
      });
    } else if (step.type === 'cross') {
      // Arrow from left operand line to right result line
      actions.push({
        type: 'gesture',
        kind: 'arrow',
        from: { x: lineX(0),           y: lineY(Math.max(0, idx - 1)) },
        to:   { x: lineX(text.length), y: lineY(idx) },
        color: '#f472b6',
      });
    } else if (step.type === 'combine') {
      actions.push({
        type: 'gesture',
        kind: 'box',
        lineIdx: idx,
        textLen: text.length,
        color: '#60a5fa',
      });
    }

    actions.push({ type: 'pause', ms: 300 });

    // Optional mid-solution question (first highlight with numeric value only)
    if (!askedOnce && step.type === 'highlight') {
      const ask = makeAsk(step);
      if (ask) { actions.push(ask); askedOnce = true; }
    }

    // Speak explanation
    actions.push({ type: 'speak', text: step.explanation });
    actions.push({ type: 'pause', ms: 350 });
  }

  // ── Final answer ───────────────────────────────────────────────────────────
  actions.push({ type: 'separator' });
  actions.push({ type: 'pause', ms: 300 });
  actions.push({ type: 'show_answer', value: result.final_answer });
  actions.push({ type: 'speak', text: `And there we go. The answer is ${result.final_answer}.` });

  return actions;
}
