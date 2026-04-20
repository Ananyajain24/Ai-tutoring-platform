import './TeacherCharacter.css';

/**
 * Anime-style math teacher character.
 * state: 'idle' | 'speaking' | 'pointing'
 */
export default function TeacherCharacter({ state = 'idle' }) {
  const speaking = state === 'speaking';
  const pointing  = state === 'pointing';

  return (
    <div className={`tc-root tc-${state}`} aria-hidden="true">
      <svg
        viewBox="0 0 120 210"
        width="128"
        height="210"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        {/* ══════════════ LEGS ══════════════ */}
        <rect x="36" y="158" width="18" height="44" rx="7" fill="#1e293b" />
        <rect x="66" y="158" width="18" height="44" rx="7" fill="#1e293b" />
        {/* Shoes */}
        <ellipse cx="45" cy="200" rx="16" ry="8" fill="#0f172a" />
        <ellipse cx="75" cy="200" rx="16" ry="8" fill="#0f172a" />

        {/* ══════════════ BODY / BROWN SUIT ══════════════ */}
        <rect x="18" y="82" width="84" height="80" rx="12" fill="#78350f" />
        {/* White shirt */}
        <rect x="43" y="82" width="34" height="55" fill="#fefce8" />
        {/* Left lapel */}
        <polygon points="43,82 20,104 43,97" fill="#92400e" />
        {/* Right lapel */}
        <polygon points="77,82 100,104 77,97" fill="#92400e" />
        {/* Red bow tie */}
        <polygon points="47,83 60,92 73,83 60,75" fill="#dc2626" />
        {/* Shirt buttons */}
        <circle cx="60" cy="103" r="3" fill="#c8a84b" />
        <circle cx="60" cy="116" r="3" fill="#c8a84b" />
        {/* Suit pocket square */}
        <rect x="21" y="90" width="10" height="8" rx="2" fill="#fef9c3" opacity="0.8" />

        {/* ══════════════ LEFT ARM ══════════════ */}
        <rect x="2" y="84" width="16" height="50" rx="8" fill="#78350f" />
        <circle cx="10" cy="136" r="10" fill="#ffd5b8" />

        {/* ══════════════ RIGHT ARM + POINTER STICK ══════════════ */}
        <g
          style={{
            transform: pointing ? 'rotate(-54deg)' : 'rotate(0deg)',
            transformOrigin: '108px 86px',
            transition: 'transform 0.46s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <rect x="102" y="84" width="16" height="50" rx="8" fill="#78350f" />
          <circle cx="110" cy="136" r="10" fill="#ffd5b8" />
          {/* Pointer stick */}
          <rect x="107" y="42" width="6" height="88" rx="3" fill="#a16207" />
          {/* Stick tip star */}
          <circle cx="110" cy="40" r="7" fill="#fbbf24" />
          <circle cx="110" cy="40" r="4" fill="#fef08a" />
          {/* Star points */}
          <polygon
            points="110,31 112,38 110,36 108,38"
            fill="#fbbf24"
          />
          <polygon
            points="110,49 112,42 110,44 108,42"
            fill="#fbbf24"
          />
          <polygon
            points="101,40 108,38 106,40 108,42"
            fill="#fbbf24"
          />
          <polygon
            points="119,40 112,38 114,40 112,42"
            fill="#fbbf24"
          />
        </g>

        {/* ══════════════ NECK ══════════════ */}
        <rect x="46" y="65" width="28" height="24" rx="10" fill="#ffd5b8" />

        {/* ══════════════ HEAD ══════════════ */}
        {/* Slightly pointed anime head shape */}
        <path
          d="M 22 46
             Q 20 16 60 8
             Q 100 16 98 46
             Q 98 78 78 88
             Q 60 96 42 88
             Q 22 78 22 46 Z"
          fill="#ffd5b8"
        />

        {/* ══════════════ HAIR ══════════════ */}
        {/* Back / top mass */}
        <ellipse cx="60" cy="10" rx="40" ry="24" fill="#1c0a00" />
        {/* Left side */}
        <rect x="20" y="18" width="12" height="34" rx="6" fill="#1c0a00" />
        {/* Right side */}
        <rect x="88" y="18" width="12" height="34" rx="6" fill="#1c0a00" />
        {/* Spiky top — three spikes */}
        <path d="M 44 5  L 38 24 L 50 18 Z" fill="#1c0a00" />
        <path d="M 60 1  L 54 20 L 66 14 Z" fill="#1c0a00" />
        <path d="M 76 5  L 70 24 L 82 18 Z" fill="#1c0a00" />
        {/* Left front bang */}
        <path d="M 24 22 Q 30 26 28 36 Q 26 42 22 46" fill="#1c0a00" stroke="#1c0a00" strokeWidth="1" />
        <path d="M 32 16 Q 36 24 34 36 Q 33 44 30 50" fill="#1c0a00" />
        {/* Right front bang */}
        <path d="M 96 22 Q 90 26 92 36 Q 94 42 98 46" fill="#1c0a00" stroke="#1c0a00" strokeWidth="1" />

        {/* ══════════════ LEFT ANIME EYE ══════════════ */}
        <g className="tc-eye-l" style={{ transformOrigin: '41px 48px' }}>
          {/* Thick upper eyelid */}
          <path d="M 25 40 Q 41 28 57 40" fill="none" stroke="#1a0a00" strokeWidth="4" strokeLinecap="round" />
          {/* White sclera */}
          <ellipse cx="41" cy="48" rx="15" ry="12" fill="white" />
          {/* Iris */}
          <ellipse cx="41" cy="49" rx="11" ry="11" fill="#1d4ed8" />
          {/* Iris sheen */}
          <ellipse cx="41" cy="44" rx="10" ry="4.5" fill="rgba(147,197,253,0.28)" />
          {/* Pupil */}
          <ellipse cx="41" cy="50" rx="5.5" ry="6.5" fill="#050514" />
          {/* Main shine */}
          <circle cx="47" cy="41" r="5" fill="white" opacity="0.95" />
          {/* Small secondary shine */}
          <circle cx="36" cy="52" r="2.2" fill="white" opacity="0.5" />
          {/* Bottom lash line */}
          <path d="M 28 55 Q 41 61 54 55" fill="none" stroke="rgba(200,120,120,0.35)" strokeWidth="1.3" />
          {/* Eyelashes top */}
          <line x1="26" y1="41" x2="23" y2="36" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
          <line x1="57" y1="41" x2="60" y2="36" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ══════════════ RIGHT ANIME EYE ══════════════ */}
        <g className="tc-eye-r" style={{ transformOrigin: '79px 48px' }}>
          <path d="M 63 40 Q 79 28 95 40" fill="none" stroke="#1a0a00" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="79" cy="48" rx="15" ry="12" fill="white" />
          <ellipse cx="79" cy="49" rx="11" ry="11" fill="#1d4ed8" />
          <ellipse cx="79" cy="44" rx="10" ry="4.5" fill="rgba(147,197,253,0.28)" />
          <ellipse cx="79" cy="50" rx="5.5" ry="6.5" fill="#050514" />
          <circle cx="85" cy="41" r="5" fill="white" opacity="0.95" />
          <circle cx="74" cy="52" r="2.2" fill="white" opacity="0.5" />
          <path d="M 66 55 Q 79 61 92 55" fill="none" stroke="rgba(200,120,120,0.35)" strokeWidth="1.3" />
          <line x1="63" y1="41" x2="60" y2="36" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
          <line x1="95" y1="41" x2="98" y2="36" stroke="#1a0a00" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ══════════════ GLASSES (over eyes) ══════════════ */}
        {/* Left lens */}
        <rect x="23" y="34" width="35" height="28" rx="6"
          fill="rgba(200,235,255,0.07)" stroke="#4b5563" strokeWidth="2.2" />
        {/* Right lens */}
        <rect x="62" y="34" width="35" height="28" rx="6"
          fill="rgba(200,235,255,0.07)" stroke="#4b5563" strokeWidth="2.2" />
        {/* Bridge */}
        <line x1="58" y1="48" x2="62" y2="48" stroke="#4b5563" strokeWidth="2.2" />
        {/* Temples */}
        <line x1="23" y1="48" x2="14" y2="52" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
        <line x1="97" y1="48" x2="106" y2="52" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
        {/* Glint lines on lenses */}
        <line x1="27" y1="37" x2="44" y2="37" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
        <line x1="66" y1="37" x2="83" y2="37" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

        {/* ══════════════ EYEBROWS ══════════════ */}
        <path d="M 24 27 Q 41 19 56 26"
          fill="none" stroke="#1c0a00" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 64 26 Q 79 19 96 27"
          fill="none" stroke="#1c0a00" strokeWidth="3.2" strokeLinecap="round" />

        {/* ══════════════ NOSE ══════════════ */}
        <path d="M 56 63 Q 60 69 64 63"
          fill="none" stroke="rgba(160,90,50,0.38)" strokeWidth="2" strokeLinecap="round" />

        {/* ══════════════ ANIME BLUSH ══════════════ */}
        <ellipse cx="24" cy="62" rx="10" ry="6" fill="rgba(255,150,150,0.22)" />
        <ellipse cx="96" cy="62" rx="10" ry="6" fill="rgba(255,150,150,0.22)" />

        {/* ══════════════ MOUTH ══════════════ */}
        {speaking ? (
          /* Open mouth — animated in CSS */
          <>
            <ellipse className="tc-mouth-open" cx="60" cy="75" rx="10" ry="7" fill="#c2410c" />
            {/* teeth */}
            <rect x="53" y="70" width="14" height="5" rx="2" fill="white" opacity="0.85" />
          </>
        ) : (
          /* Gentle anime smile */
          <path d="M 51 74 Q 60 83 69 74"
            fill="none" stroke="#7c2d12" strokeWidth="2.4" strokeLinecap="round" />
        )}

        {/* ══════════════ SHINE DOTS (anime sparkle) ══════════════ */}
        <circle cx="14" cy="32" r="2" fill="white" opacity="0.5" />
        <circle cx="18" cy="27" r="1.2" fill="white" opacity="0.35" />
        <circle cx="106" cy="32" r="2" fill="white" opacity="0.5" />
        <circle cx="102" cy="27" r="1.2" fill="white" opacity="0.35" />
      </svg>

      {/* Voice wave when speaking */}
      {speaking && (
        <div className="tc-wave" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
      )}
    </div>
  );
}
