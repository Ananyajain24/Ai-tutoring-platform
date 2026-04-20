/**
 * Nikhilam Navatashcaramam Dashatah simulator.
 * Layout (two halves separated by a divider column):
 *
 *  COL:  0   1  [div]  2   3   4
 *        9   7    |   -   0   3    ← number | deviation from base
 *        8   5    |   -   1   5
 *       ─────────────────────────
 *        8   2    |       4   5    ← left result | right result
 *
 * Grid rows:
 *   ROW_A      = 0
 *   ROW_B      = 1
 *   ROW_RESULT = 2
 * Grid cols layout: [numCols] [divider] [devCols]
 */

export const ROW_A      = 0;
export const ROW_B      = 1;
export const ROW_RESULT = 2;
export const TOTAL_ROWS = 3;

function nearestBase(n) {
  if (n <= 10)   return 10;
  if (n <= 100)  return 100;
  if (n <= 1000) return 1000;
  return Math.pow(10, Math.ceil(Math.log10(n)));
}

export function simulateNikhilam(a, b) {
  const base = nearestBase(Math.max(a, b));
  const devA = a - base;
  const devB = b - base;

  // Left part = a + devB  (or equivalently b + devA)
  const leftResult  = a + devB;
  // Right part = devA × devB
  const rightResult = devA * devB;
  // Final
  const baseDigits = String(base).length - 1; // zeros in base (e.g. base=100 → 2)

  const numCols = String(base).length - 1;    // digits to show per number (e.g. 2 for base 100)
  const devCols = numCols + 1;                // deviation may need sign + digits
  const DIV_COL = numCols;                    // divider column index
  const COLS    = numCols + 1 + devCols;      // total cols including divider

  function numDigits(n, cols) {
    return String(Math.abs(n)).padStart(cols, '0').split('');
  }

  const actions = [];

  // ── Write first number ───────────────────────────────────────────────────
  actions.push({ type: 'speak', text: `Let me write ${a}.` });
  const aStr = numDigits(a, numCols);
  for (let i = 0; i < aStr.length; i++) {
    actions.push({ type: 'move_cursor', row: ROW_A, col: i });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_A, col: i, value: aStr[i] });
    actions.push({ type: 'pause', ms: 180 });
  }

  // Divider
  actions.push({ type: 'write_digit', row: ROW_A, col: DIV_COL, value: '|', isOperator: true });

  // Deviation of a
  const devAStr   = (devA < 0 ? '−' : '+') + String(Math.abs(devA)).padStart(numCols, '0');
  const devAChars = devAStr.split('');
  actions.push({ type: 'speak', text: `${a} is ${Math.abs(devA)} ${devA < 0 ? 'below' : 'above'} ${base}. Deviation: ${devA}.` });
  for (let i = 0; i < devAChars.length; i++) {
    const col = DIV_COL + 1 + i;
    actions.push({ type: 'move_cursor', row: ROW_A, col });
    actions.push({ type: 'pause', ms: 250 });
    actions.push({ type: 'write_digit', row: ROW_A, col, value: devAChars[i], isOperator: devAChars[i] === '−' });
    actions.push({ type: 'pause', ms: 150 });
  }

  // ── Write second number ──────────────────────────────────────────────────
  actions.push({ type: 'speak', text: `Now ${b}.` });
  const bStr = numDigits(b, numCols);
  for (let i = 0; i < bStr.length; i++) {
    actions.push({ type: 'move_cursor', row: ROW_B, col: i });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_B, col: i, value: bStr[i] });
    actions.push({ type: 'pause', ms: 180 });
  }
  actions.push({ type: 'write_digit', row: ROW_B, col: DIV_COL, value: '|', isOperator: true });

  const devBStr   = (devB < 0 ? '−' : '+') + String(Math.abs(devB)).padStart(numCols, '0');
  const devBChars = devBStr.split('');
  actions.push({ type: 'speak', text: `${b} is ${Math.abs(devB)} ${devB < 0 ? 'below' : 'above'} ${base}. Deviation: ${devB}.` });
  for (let i = 0; i < devBChars.length; i++) {
    const col = DIV_COL + 1 + i;
    actions.push({ type: 'move_cursor', row: ROW_B, col });
    actions.push({ type: 'pause', ms: 250 });
    actions.push({ type: 'write_digit', row: ROW_B, col, value: devBChars[i], isOperator: devBChars[i] === '−' });
    actions.push({ type: 'pause', ms: 150 });
  }

  actions.push({ type: 'pause', ms: 400 });
  actions.push({ type: 'draw_line' });
  actions.push({ type: 'pause', ms: 500 });

  // ── Left result: cross-add ───────────────────────────────────────────────
  actions.push({
    type: 'highlight',
    cells: [{ row: ROW_A, col: 0 }, { row: ROW_A, col: numCols - 1 },
            { row: ROW_B, col: DIV_COL + 1 }],
    color: '#34d399',
  });
  actions.push({ type: 'speak', text: `Cross add: ${a} plus ${devB} equals ${leftResult}.` });

  // Interaction
  actions.push({
    type: 'ask',
    question: `What is ${a} + (${devB})?`,
    answer:   String(leftResult),
    hint:     `Add the deviation of the second number to the first: ${a} + ${devB}.`,
  });

  const leftStr = numDigits(leftResult, numCols);
  for (let i = 0; i < leftStr.length; i++) {
    actions.push({ type: 'move_cursor', row: ROW_RESULT, col: i });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_RESULT, col: i, value: leftStr[i] });
    actions.push({ type: 'pause', ms: 180 });
  }
  actions.push({ type: 'write_digit', row: ROW_RESULT, col: DIV_COL, value: '|', isOperator: true });
  actions.push({ type: 'clear_highlight' });
  actions.push({ type: 'pause', ms: 350 });

  // ── Right result: multiply deviations ───────────────────────────────────
  actions.push({
    type: 'highlight',
    cells: [
      { row: ROW_A, col: DIV_COL + 1 },
      { row: ROW_B, col: DIV_COL + 1 },
    ],
    color: '#f472b6',
  });
  actions.push({ type: 'speak', text: `Now multiply the deviations: ${devA} times ${devB} equals ${rightResult}.` });

  const rightStr = String(Math.abs(rightResult)).padStart(baseDigits, '0').split('');
  for (let i = 0; i < rightStr.length; i++) {
    const col = DIV_COL + 1 + i;
    actions.push({ type: 'move_cursor', row: ROW_RESULT, col });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_RESULT, col, value: rightStr[i] });
    actions.push({ type: 'pause', ms: 180 });
  }
  actions.push({ type: 'clear_highlight' });
  actions.push({ type: 'pause', ms: 400 });

  actions.push({ type: 'move_cursor', row: -1, col: -1 });
  actions.push({ type: 'pause', ms: 300 });
  actions.push({ type: 'show_answer', value: String(a * b) });
  actions.push({ type: 'speak', text: `Combine: ${leftResult} and ${String(Math.abs(rightResult)).padStart(baseDigits, '0')} gives ${a * b}.` });

  return {
    actions,
    meta: { rows: TOTAL_ROWS, cols: COLS, divCol: DIV_COL, unitCol: COLS - 1 },
  };
}
