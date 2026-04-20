import { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import Whiteboard from './components/Whiteboard';
import PracticePanel from './components/PracticePanel';
import './App.css';

export default function App() {
  const [mode, setMode] = useState('tutor');
  const [tutorResult, setTutorResult] = useState(null);
  const [tutorProblem, setTutorProblem] = useState('');

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-symbol">ॐ</span>
          <span className="logo-text">Vedic Maths Tutor</span>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-btn ${mode === 'tutor' ? 'active' : ''}`}
            onClick={() => setMode('tutor')}
          >
            Tutor
          </button>
          <button
            className={`nav-btn ${mode === 'practice' ? 'active' : ''}`}
            onClick={() => setMode('practice')}
          >
            Practice
          </button>
        </nav>
      </header>

      <main className="app-main">
        {mode === 'tutor' ? (
          <div className="tutor-layout">
            <ChatPanel onSolution={(r, p) => { setTutorResult(r); setTutorProblem(p); }} />
            <Whiteboard result={tutorResult} problem={tutorProblem} />
          </div>
        ) : (
          <PracticePanel />
        )}
      </main>
    </div>
  );
}
