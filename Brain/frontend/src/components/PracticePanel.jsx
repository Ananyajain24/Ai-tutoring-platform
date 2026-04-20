import { useState } from 'react';
import { generatePractice, evaluate, getFeedback } from '../api/index.js';
import './PracticePanel.css';

const TOPICS = ['Nikhilam', 'Urdhva Tiryagbhyam', 'Ekadhikena Purvena', 'Yavadunam', 'Anurupyena'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function PracticePanel() {
  const [topic, setTopic]           = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState('beginner');
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [results, setResults]       = useState({});
  const [feedback, setFeedback]     = useState({});
  const [loading, setLoading]       = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState({});

  async function handleGenerate() {
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setResults({});
    setFeedback({});
    try {
      const data = await generatePractice(topic, difficulty, 5);
      setQuestions(data.questions ?? []);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheck(q) {
    const studentAnswer = answers[q.id];
    if (studentAnswer === undefined || studentAnswer === '') return;

    const evalResult = await evaluate(studentAnswer, q.expected_answer);
    setResults(prev => ({ ...prev, [q.id]: evalResult }));

    if (!evalResult.is_correct) {
      setLoadingFeedback(prev => ({ ...prev, [q.id]: true }));
      try {
        const fb = await getFeedback(q.question, studentAnswer, q.expected_answer, topic);
        setFeedback(prev => ({ ...prev, [q.id]: fb }));
      } catch {
        // Feedback is non-critical — silently skip
      } finally {
        setLoadingFeedback(prev => ({ ...prev, [q.id]: false }));
      }
    }
  }

  const score = Object.values(results).filter(r => r.is_correct).length;
  const attempted = Object.keys(results).length;

  return (
    <div className="practice-panel">
      <div className="practice-config">
        <div className="config-row">
          <label className="config-label">Topic</label>
          <select className="config-select" value={topic} onChange={e => setTopic(e.target.value)}>
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="config-row">
          <label className="config-label">Difficulty</label>
          <div className="difficulty-group">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : '⚡ Generate Questions'}
        </button>
      </div>

      {attempted > 0 && (
        <div className="practice-score">
          Score: <strong>{score} / {attempted}</strong> checked
        </div>
      )}

      <div className="practice-questions">
        {questions.map(q => {
          const result = results[q.id];
          const fb     = feedback[q.id];

          return (
            <div
              key={q.id}
              className={`question-card ${result ? (result.is_correct ? 'correct' : 'incorrect') : ''}`}
            >
              <div className="question-header">
                <span className="question-num">Q{q.id}</span>
                <span className="question-text">{q.question}</span>
              </div>

              <div className="question-answer-row">
                <input
                  className="answer-input"
                  type="number"
                  placeholder="Your answer"
                  value={answers[q.id] ?? ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  disabled={!!result}
                />
                {!result ? (
                  <button
                    className="check-btn"
                    onClick={() => handleCheck(q)}
                    disabled={!answers[q.id]}
                  >
                    Check
                  </button>
                ) : (
                  <span className={`result-badge ${result.is_correct ? 'badge-correct' : 'badge-wrong'}`}>
                    {result.is_correct ? '✓ Correct' : `✗ Ans: ${q.expected_answer}`}
                  </span>
                )}
              </div>

              {loadingFeedback[q.id] && (
                <p className="feedback-loading">Getting feedback…</p>
              )}

              {fb && !fb.out_of_scope && (
                <div className="feedback-panel">
                  <p className="feedback-diagnosis">{fb.diagnosis}</p>
                  {fb.correction && (
                    <div className="feedback-correction">
                      <span className="correction-label">Step {fb.correction.step_id}:</span>
                      {' '}{fb.correction.explanation}
                    </div>
                  )}
                  <p className="feedback-encouragement">💬 {fb.encouragement}</p>
                  {fb.follow_up && (
                    <div className="feedback-followup">
                      Try this: <strong>{fb.follow_up.question}</strong>
                      <span className="followup-hint"> — {fb.follow_up.hint}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {!loading && questions.length === 0 && (
          <div className="practice-empty">
            <span>🏏</span>
            <p>Select a topic and generate questions to start practising.</p>
          </div>
        )}
      </div>
    </div>
  );
}
