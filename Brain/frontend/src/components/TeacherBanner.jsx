import './TeacherBanner.css';

export default function TeacherBanner({ text }) {
  if (!text) return null;
  return (
    <div className="tb-wrap" key={text}>
      <span className="tb-quill">✏️</span>
      <p className="tb-text">{text}</p>
    </div>
  );
}
