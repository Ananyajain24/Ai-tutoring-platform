import { useState, useRef, useEffect } from 'react';
import './InteractionPrompt.css';

/**
 * Mid-solution question prompt.
 * Renders as an overlay on the whiteboard.
 * Calls onCorrect() when student answers correctly.
 * Calls onSkip() if student wants to continue without answering.
 */
export default function InteractionPrompt({ question, answer, hint, onCorrect, onSkip }) {
  const [input,      setInput]      = useState('');
  const [status,     setStatus]     = useState('idle'); // idle | correct | wrong
  const [showHint,   setShowHint]   = useState(false);
  const [attempts,   setAttempts]   = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const userAns = input.trim().replace(/\s/g, '');
    const correct = String(answer).trim().replace(/\s/g, '');

    if (userAns === correct) {
      setStatus('correct');
      setTimeout(onCorrect, 900);
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setStatus('wrong');
      if (next >= 2) setShowHint(true);
      setTimeout(() => setStatus('idle'), 1200);
    }
  }

  return (
    <div className="ip-overlay">
      <div className="ip-card">
        <div className="ip-icon">🤔</div>
        <p className="ip-question">{question}</p>

        {showHint && (
          <p className="ip-hint">{hint}</p>
        )}

        <form className="ip-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={`ip-input ${status === 'wrong' ? 'ip-wrong' : ''} ${status === 'correct' ? 'ip-correct' : ''}`}
            type="text"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Your answer…"
            disabled={status === 'correct'}
          />
          <button className="ip-submit" type="submit" disabled={!input.trim() || status === 'correct'}>
            {status === 'correct' ? '✓' : 'Check'}
          </button>
        </form>

        {status === 'wrong' && (
          <p className="ip-feedback-wrong">Not quite — try again{attempts >= 2 ? ' (see hint above)' : ''}.</p>
        )}
        {status === 'correct' && (
          <p className="ip-feedback-correct">Correct! Well done. Continuing…</p>
        )}

        {!showHint && (
          <button className="ip-hint-btn" onClick={() => setShowHint(true)}>Show hint</button>
        )}
        <button className="ip-skip" onClick={onSkip}>Skip question →</button>
      </div>
    </div>
  );
}
