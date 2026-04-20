import './TeacherCharacter.css';

/**
 * Illustrated AI teacher character.
 * state: 'idle' | 'speaking' | 'pointing'
 */
export default function TeacherCharacter({ state = 'idle' }) {
  const speaking = state === 'speaking';
  const pointing = state === 'pointing';

  /* Right-arm transform: shoulder pivot at (87, 66) */
  const armTransform = pointing
    ? 'rotate(-58deg)'
    : 'rotate(0deg)';
  const armOrigin = '87px 66px';

  return (
    <div className={`tc-root tc-${state}`} aria-hidden="true">
      <svg
        viewBox="0 0 110 185"
        width="110"
        height="185"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {/* ─ Legs ─ */}
        <rect x="33" y="130" width="16" height="44" rx="6" fill="#1e293b" />
        <rect x="61" y="130" width="16" height="44" rx="6" fill="#1e293b" />
        <ellipse cx="41" cy="172" rx="13" ry="7" fill="#0f172a" />
        <ellipse cx="69" cy="172" rx="13" ry="7" fill="#0f172a" />

        {/* ─ Body / Suit ─ */}
        <rect x="24" y="70" width="62" height="64" rx="9" fill="#78350f" />
        {/* Shirt */}
        <rect x="42" y="70" width="26" height="44" fill="#fefce8" />
        {/* Left lapel */}
        <polygon points="42,70 27,90 42,84" fill="#92400e" />
        {/* Right lapel */}
        <polygon points="68,70 83,90 68,84" fill="#92400e" />
        {/* Bow tie */}
        <polygon points="46,72 55,79 64,72 55,66" fill="#dc2626" />
        {/* Shirt button */}
        <circle cx="55" cy="90" r="2" fill="#d4a017" />
        <circle cx="55" cy="100" r="2" fill="#d4a017" />

        {/* ─ Left arm (down, chalk) ─ */}
        <rect x="8" y="72" width="16" height="40" rx="8" fill="#78350f" />
        <circle cx="16" cy="114" r="8" fill="#fcd9a5" />
        {/* chalk */}
        <rect x="11" y="118" width="10" height="18" rx="5" fill="#f8fafc" />
        <rect x="11" y="133" width="10" height="5" rx="3" fill="#fbbf24" />

        {/* ─ Right arm (rotates when pointing) ─ */}
        <g
          className="tc-arm-right"
          style={{
            transform: armTransform,
            transformOrigin: armOrigin,
            transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <rect x="86" y="70" width="16" height="40" rx="8" fill="#78350f" />
          <circle cx="94" cy="112" r="8" fill="#fcd9a5" />
          {/* Pointer stick (always rendered — visible only when arm is raised) */}
          <line
            x1="94" y1="104"
            x2="94" y2="52"
            stroke="#a16207"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity={pointing ? 1 : 0}
            style={{ transition: 'opacity 0.2s' }}
          />
          <circle cx="94" cy="50" r="4.5" fill="#fbbf24" opacity={pointing ? 1 : 0}
            style={{ transition: 'opacity 0.2s' }} />
        </g>

        {/* ─ Neck ─ */}
        <rect x="42" y="56" width="26" height="20" rx="8" fill="#fcd9a5" />

        {/* ─ Head ─ */}
        <circle cx="55" cy="38" r="30" fill="#fcd9a5" />

        {/* Hair */}
        <ellipse cx="55" cy="11" rx="30" ry="17" fill="#1c0a00" />
        <rect x="25" y="20" width="8" height="22" rx="4" fill="#1c0a00" />
        <rect x="77" y="20" width="8" height="22" rx="4" fill="#1c0a00" />

        {/* ─ Glasses ─ */}
        <rect x="23" y="31" width="21" height="14" rx="6"
          fill="rgba(186,230,253,0.38)" stroke="#374151" strokeWidth="2.2" />
        <rect x="66" y="31" width="21" height="14" rx="6"
          fill="rgba(186,230,253,0.38)" stroke="#374151" strokeWidth="2.2" />
        {/* bridge */}
        <line x1="44" y1="38" x2="66" y2="38" stroke="#374151" strokeWidth="2" />
        {/* temples */}
        <line x1="23" y1="38" x2="16" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <line x1="87" y1="38" x2="94" y2="40" stroke="#374151" strokeWidth="2" strokeLinecap="round" />

        {/* ─ Eyes (with blink class) ─ */}
        <ellipse className="tc-eye" cx="33" cy="38" rx="4" ry="4" fill="#1e1b4b" />
        <ellipse className="tc-eye" cx="77" cy="38" rx="4" ry="4" fill="#1e1b4b" />
        {/* eye shine */}
        <circle cx="35" cy="36" r="1.5" fill="white" />
        <circle cx="79" cy="36" r="1.5" fill="white" />

        {/* ─ Eyebrows ─ */}
        <path d="M 25 26 Q 33 21 41 26"
          fill="none" stroke="#1c0a00" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M 69 26 Q 77 21 85 26"
          fill="none" stroke="#1c0a00" strokeWidth="2.8" strokeLinecap="round" />

        {/* ─ Nose ─ */}
        <path d="M 52 44 Q 55 50 58 44"
          fill="none" stroke="rgba(150,80,30,0.3)" strokeWidth="1.5" strokeLinecap="round" />

        {/* ─ Mouth ─ */}
        {speaking ? (
          <ellipse className="tc-mouth-open" cx="55" cy="54" rx="8" ry="5" fill="#c2410c" />
        ) : (
          <path d="M 46 53 Q 55 61 64 53"
            fill="none" stroke="#7c2d12" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </svg>

      {/* Speaking wave indicator */}
      {speaking && (
        <div className="tc-wave" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
      )}
    </div>
  );
}
