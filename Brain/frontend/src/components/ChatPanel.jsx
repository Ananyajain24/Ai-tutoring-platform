import { useState, useRef, useEffect } from 'react';
import { solveProblem } from '../api/index.js';
import './ChatPanel.css';

export default function ChatPanel({ onSolution }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'tutor',
      text: 'Hello! Give me any multiplication problem and I\'ll solve it using Vedic Maths. Try: 97 × 85',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = input.trim();
    if (!problem || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'student', text: problem }]);
    setLoading(true);

    try {
      const result = await solveProblem(problem);

      if (result.out_of_scope) {
        setMessages(prev => [...prev, { role: 'tutor', text: result.message }]);
        return;
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          text: `Using ${result.method} — watch the whiteboard!`,
          result,
        },
      ]);
      onSolution(result, problem);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'tutor', text: `Error: ${err.message}`, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">Ask your tutor</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role} ${msg.isError ? 'message-error' : ''}`}>
            {msg.role === 'tutor' && <span className="message-avatar">🧮</span>}
            <div className="message-bubble">
              <p>{msg.text}</p>
              {msg.result && (
                <p className="message-answer">
                  Answer: <strong>{msg.result.final_answer}</strong>
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message message-tutor">
            <span className="message-avatar">🧮</span>
            <div className="message-bubble">
              <span className="loading-dots"><span /><span /><span /></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 97 × 85 or 35²"
          disabled={loading}
          autoFocus
        />
        <button className="chat-submit" type="submit" disabled={loading || !input.trim()}>
          →
        </button>
      </form>
    </div>
  );
}
