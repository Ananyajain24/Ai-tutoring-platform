/**
 * Urdhva Tiryagbhyam digit-level grid simulator.
 * Produces a flat action sequence + grid metadata.
 *
 * Grid rows:
 *   ROW_CARRY  = 0  (small carry digits)
 *   ROW_A      = 1  (multiplicand)
 *   ROW_B      = 2  (multiplier, with × operator)
 *   ROW_RESULT = 3  (result, filled right-to-left)
 *
 * Columns: 0..COLS-1, rightmost (units) = UNIT_COL
 */

export const ROW_CARRY  = 0;
export const ROW_A      = 1;
export const ROW_B      = 2;
export const ROW_RESULT = 3;
export const TOTAL_ROWS = 4;

export function simulateUrdhva(a, b) {
  const n     = Math.max(String(a).length, String(b).length);
  const aDigs = String(a).padStart(n, '0').split('').map(Number);
  const bDigs = String(b).padStart(n, '0').split('').map(Number);

  const COLS     = 2 * n;
  const UNIT_COL = COLS - 1;

  // colOf(digitIndex) → column index (left-to-right)
  const colOf = (i) => UNIT_COL - (n - 1) + i; // aDigs[0] → tens col, aDigs[n-1] → units col

  const actions  = [];
  const carries  = {}; // position-from-right → accumulated carry

  // ── Write multiplicand ───────────────────────────────────────────────────
  actions.push({ type: 'speak', text: `I will write ${a}.` });
  for (let i = 0; i < n; i++) {
    const col = colOf(i);
    actions.push({ type: 'move_cursor', row: ROW_A, col });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_A, col, value: aDigs[i] });
    actions.push({ type: 'pause', ms: 180 });
  }

  // ── Write × operator and multiplier ─────────────────────────────────────
  const opCol = UNIT_COL - n;
  if (opCol >= 0) {
    actions.push({ type: 'write_digit', row: ROW_B, col: opCol, value: '×', isOperator: true });
  }
  actions.push({ type: 'speak', text: `Multiplied by ${b}.` });
  for (let i = 0; i < n; i++) {
    const col = colOf(i);
    actions.push({ type: 'move_cursor', row: ROW_B, col });
    actions.push({ type: 'pause', ms: 270 });
    actions.push({ type: 'write_digit', row: ROW_B, col, value: bDigs[i] });
    actions.push({ type: 'pause', ms: 180 });
  }

  actions.push({ type: 'pause', ms: 450 });
  actions.push({ type: 'draw_line' });
  actions.push({ type: 'pause', ms: 500 });
  actions.push({ type: 'speak', text: 'Now — Urdhva Tiryagbhyam. Vertically and crosswise.' });
  actions.push({ type: 'pause', ms: 700 });

  // ── Multiplication steps ─────────────────────────────────────────────────
  // Position p (from right, 0=units): pairs (i,j) where i+j=p, 0≤i,j<n
  // Digit accessed: aDigs[n-1-i] (position i from right in a)

  let askedQuestion = false;

  for (let p = 0; p < 2 * n - 1; p++) {
    const colResult = UNIT_COL - p;

    const pairs = [];
    for (let i = 0; i < n; i++) {
      const j = p - i;
      if (j >= 0 && j < n) {
        pairs.push({
          ai:   aDigs[n - 1 - i],
          bj:   bDigs[n - 1 - j],
          colA: UNIT_COL - i,
          colB: UNIT_COL - j,
        });
      }
    }
    if (!pairs.length) continue;

    const carry   = carries[p] ?? 0;
    const sum     = pairs.reduce((s, { ai, bj }) => s + ai * bj, 0) + carry;
    const digit   = sum % 10;
    const newCarry = Math.floor(sum / 10);

    // Highlight operand cells (and carry cell if applicable)
    const hlCells = pairs.flatMap(({ colA, colB }) => [
      { row: ROW_A, col: colA },
      { row: ROW_B, col: colB },
    ]);
    if (carry > 0) hlCells.push({ row: ROW_CARRY, col: colResult });

    actions.push({ type: 'highlight', cells: hlCells, color: '#fbbf24' });
    actions.push({ type: 'pause', ms: 350 });

    // Voice: describe the operation
    const pairText = pairs.map(({ ai, bj }) => `${ai} times ${bj}`).join(', plus ');
    const carryText = carry > 0 ? `, plus carry ${carry}` : '';
    actions.push({ type: 'speak', text: `${pairText}${carryText}.` });

    // Interaction: ask first single-product step
    if (!askedQuestion && pairs.length === 1) {
      actions.push({
        type: 'ask',
        question: `What is ${pairs[0].ai} × ${pairs[0].bj}?`,
        answer:   String(pairs[0].ai * pairs[0].bj),
        hint:     `Think: ${pairs[0].ai} × ${pairs[0].bj} = ?`,
      });
      askedQuestion = true;
    }

    // Move cursor to result position
    actions.push({ type: 'move_cursor', row: ROW_RESULT, col: colResult });
    actions.push({ type: 'pause', ms: 380 });

    // Announce result
    const resultText = newCarry > 0
      ? `That is ${sum}. I write ${digit} and carry ${newCarry}.`
      : `That is ${sum}. I write ${digit}.`;
    actions.push({ type: 'speak', text: resultText });

    actions.push({ type: 'write_digit', row: ROW_RESULT, col: colResult, value: digit });
    actions.push({ type: 'pause', ms: 280 });

    if (newCarry > 0) {
      carries[p + 1] = (carries[p + 1] ?? 0) + newCarry;
      const carryCol = colResult - 1;
      if (carryCol >= 0) {
        actions.push({ type: 'write_carry', row: ROW_CARRY, col: carryCol, value: newCarry });
        actions.push({ type: 'pause', ms: 220 });
      }
    }

    actions.push({ type: 'clear_highlight' });
    actions.push({ type: 'pause', ms: 450 });
  }

  // ── Final overflow carry ─────────────────────────────────────────────────
  const overflow = carries[2 * n - 1] ?? 0;
  if (overflow > 0) {
    const fc = UNIT_COL - (2 * n - 1);
    if (fc >= 0) {
      actions.push({ type: 'move_cursor', row: ROW_RESULT, col: fc });
      actions.push({ type: 'pause', ms: 200 });
      actions.push({ type: 'write_digit', row: ROW_RESULT, col: fc, value: overflow });
      actions.push({ type: 'pause', ms: 200 });
    }
  }

  actions.push({ type: 'move_cursor', row: -1, col: -1 }); // hide cursor
  actions.push({ type: 'pause', ms: 400 });
  actions.push({ type: 'show_answer', value: String(a * b) });
  actions.push({ type: 'speak', text: `The answer is ${a * b}.` });

  return {
    actions,
    meta: { rows: TOTAL_ROWS, cols: COLS, unitCol: UNIT_COL },
  };
}
