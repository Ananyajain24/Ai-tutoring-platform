import { useState, useEffect, useRef, useCallback } from 'react';
import { compileGrid } from '../lib/gridCompiler.js';
import InteractionPrompt from './InteractionPrompt.jsx';
import './Whiteboard.css';

// ── Helpers ────────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

function speakAndWait(text, voiceRef) {
  return new Promise(resolve => {
    if (!window.speechSynthesis || !voiceRef.current) { sleep(600).then(resolve); return; }
    window.speechSynthesis.cancel();
    const u   = new SpeechSynthesisUtterance(text);
    u.rate    = 0.88;
    u.pitch   = 1.05;
    u.onend   = resolve;
    u.onerror = resolve;
    window.speechSynthesis.speak(u);
  });
}

function makeGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      value: '', carry: '', highlighted: false, color: '', isOperator: false,
    }))
  );
}

// ── Cell ───────────────────────────────────────────────────────────────────

function Cell({ cell, isCursor, isCarryRow }) {
  const cls = [
    'gc',
    isCarryRow                     && 'gc-carry-row',
    cell.isOperator                && 'gc-operator',
    cell.highlighted               && 'gc-hl',
    cell.value === '|'             && 'gc-divider',
    isCursor && !isCarryRow        && 'gc-cursor',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={cell.highlighted && cell.color ? { '--hl': cell.color } : undefined}
    >
      {isCarryRow
        ? <span className="gc-small">{cell.value}</span>
        : <span className="gc-digit">{cell.value}</span>
      }
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────

function Row({ cells, rowIdx, cursor, isCarryRow }) {
  return (
    <div className={`gr ${isCarryRow ? 'gr-carry' : ''}`}>
      {cells.map((cell, col) => (
        <Cell
          key={col}
          cell={cell}
          isCursor={cursor?.row === rowIdx && cursor?.col === col}
          isCarryRow={isCarryRow}
        />
      ))}
    </div>
  );
}

// ── Main Whiteboard ────────────────────────────────────────────────────────

export default function Whiteboard({ result, problem }) {
  const [meta,        setMeta]        = useState(null);
  const [cells,       setCells]       = useState([]);
  const [showLine,    setShowLine]    = useState(false);
  const [cursor,      setCursor]      = useState(null);   // { row, col } | null
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [interaction, setInteraction] = useState(null);
  const [isRunning,   setIsRunning]   = useState(false);
  const [voiceOn,     setVoiceOn]     = useState(true);
  const [methodLabel, setMethodLabel] = useState('');
  const [compileError, setCompileError] = useState(null);

  const cancelRef = useRef(false);
  const voiceRef  = useRef(true);

  useEffect(() => { voiceRef.current = voiceOn; }, [voiceOn]);

  // ── Action primitives ────────────────────────────────────────────────────

  function updateCell(row, col, patch) {
    setCells(prev => {
      const next = prev.map(r => [...r]);
      if (next[row]?.[col]) next[row][col] = { ...next[row][col], ...patch };
      return next;
    });
  }

  function moveCursor(row, col) {
    if (row < 0) { setCursor(null); return sleep(100); }
    setCursor({ row, col });
    return sleep(320); // CSS transition duration
  }

  function writeDigit(row, col, value, isOperator = false) {
    updateCell(row, col, { value: String(value), isOperator });
    return sleep(200);
  }

  function writeCarry(row, col, value) {
    updateCell(row, col, { value: String(value) });
    return sleep(180);
  }

  function highlight(cells_list, color) {
    setCells(prev => {
      const next = prev.map(r => [...r]);
      cells_list.forEach(({ row, col }) => {
        if (next[row]?.[col]) next[row][col] = { ...next[row][col], highlighted: true, color };
      });
      return next;
    });
    return sleep(280);
  }

  function clearHighlight() {
    setCells(prev =>
      prev.map(r => r.map(c => ({ ...c, highlighted: false, color: '' })))
    );
    return sleep(100);
  }

  function askStudent(question, answer, hint) {
    return new Promise(resolve => {
      window.speechSynthesis?.cancel();
      setInteraction({ question, answer, hint, resolve });
    });
  }

  // ── Executor ─────────────────────────────────────────────────────────────

  const execute = useCallback(async (action) => {
    if (cancelRef.current) return;
    switch (action.type) {
      case 'move_cursor':   await moveCursor(action.row, action.col); break;
      case 'write_digit':   await writeDigit(action.row, action.col, action.value, action.isOperator); break;
      case 'write_carry':   await writeCarry(action.row, action.col, action.value); break;
      case 'highlight':     await highlight(action.cells, action.color); break;
      case 'clear_highlight': await clearHighlight(); break;
      case 'draw_line':     setShowLine(true); await sleep(400); break;
      case 'speak':         await speakAndWait(action.text, voiceRef); break;
      case 'pause':         await sleep(action.ms); break;
      case 'show_answer':   setFinalAnswer(action.value); break;
      case 'ask':
        await askStudent(action.question, action.answer, action.hint);
        setInteraction(null);
        break;
    }
  }, []); // eslint-disable-line

  async function runActions(actions) {
    setIsRunning(true);
    for (const a of actions) {
      if (cancelRef.current) break;
      await execute(a);
    }
    setIsRunning(false);
  }

  // ── Launch when result changes ───────────────────────────────────────────

  useEffect(() => {
    if (!result) return;
    cancelRef.current = true;
    window.speechSynthesis?.cancel();

    setTimeout(() => {
      cancelRef.current = false;
      setShowLine(false);
      setFinalAnswer(null);
      setInteraction(null);
      setCursor(null);
      setCompileError(null);
      setMethodLabel(result.method ?? '');

      try {
        const { actions, meta: m } = compileGrid(result, problem);
        setMeta(m);
        setCells(makeGrid(m.rows, m.cols));
        runActions(actions);
      } catch (err) {
        console.error('[Whiteboard] compileGrid failed:', err);
        setCompileError(err.message);
      }
    }, 150);
  }, [result]); // eslint-disable-line

  // ── Render ───────────────────────────────────────────────────────────────

  if (!result) {
    return (
      <div className="whiteboard whiteboard-empty">
        <div className="wb-placeholder">
          <span className="wb-ph-icon">📐</span>
          <p>Type a problem — watch it solved digit by digit.</p>
        </div>
      </div>
    );
  }

  // Row index constants (0=carry, 1=A, 2=B, 3=result for Urdhva)
  const ROW_CARRY  = 0;
  const hasCarryRow = meta?.rows >= 4; // Urdhva has 4 rows, Nikhilam 3

  return (
    <div className="whiteboard">
      {/* Header */}
      <div className="wb-header">
        <span className="wb-method">{methodLabel}</span>
        <div className="wb-controls">
          <button className="wb-ctrl" onClick={() => { window.speechSynthesis?.cancel(); setVoiceOn(v => !v); }}>
            {voiceOn ? '🔊' : '🔇'}
          </button>
          {isRunning && <span className="wb-dot" />}
        </div>
      </div>

      {/* Grid */}
      <div className="wb-board">
        {compileError && (
          <div style={{ color: '#f472b6', fontSize: 13, textAlign: 'center', padding: '12px' }}>
            Could not render grid: {compileError}
          </div>
        )}
        {meta && cells.length > 0 && (
          <div className="wb-grid-wrap">
            <div className="wb-grid">
              {/* Carry row (Urdhva only) */}
              {hasCarryRow && (
                <Row
                  cells={cells[ROW_CARRY] ?? []}
                  rowIdx={ROW_CARRY}
                  cursor={cursor}
                  isCarryRow
                />
              )}

              {/* Number rows */}
              {cells.slice(hasCarryRow ? 1 : 0, hasCarryRow ? 3 : 2).map((row, i) => {
                const rowIdx = hasCarryRow ? i + 1 : i;
                return (
                  <Row key={rowIdx} cells={row} rowIdx={rowIdx} cursor={cursor} isCarryRow={false} />
                );
              })}

              {/* Separator line */}
              {showLine && (
                <div className="wb-grid-line" style={{ gridColumn: `span ${meta.cols}` }} />
              )}

              {/* Result row */}
              {cells[meta.rows - 1] && (
                <Row
                  cells={cells[meta.rows - 1]}
                  rowIdx={meta.rows - 1}
                  cursor={cursor}
                  isCarryRow={false}
                />
              )}
            </div>

            {/* Final answer banner */}
            {finalAnswer && (
              <div className="wb-answer">
                <span className="wb-answer-eq">=</span>
                <span className="wb-answer-val">{finalAnswer}</span>
              </div>
            )}
          </div>
        )}

        {/* Mid-solution interaction overlay */}
        {interaction && (
          <InteractionPrompt
            question={interaction.question}
            answer={interaction.answer}
            hint={interaction.hint}
            onCorrect={() => { setInteraction(null); interaction.resolve(); }}
            onSkip={() => { setInteraction(null); interaction.resolve(); }}
          />
        )}
      </div>
    </div>
  );
}
