import { useEffect, useRef } from 'react';
import { LINE_H, CHAR_W, PAD_L, PAD_T, lineY, lineX } from '../lib/actionCompiler.js';

/**
 * SVG overlay drawn on top of the whiteboard content.
 * Gestures animate in using stroke-dashoffset technique.
 * pointer-events: none — never blocks text interaction.
 */

function AnimatedPath({ d, color, strokeWidth = 2, duration = 500, delay = 0, fill = 'none' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const len = el.getTotalLength?.() ?? 200;
    el.style.strokeDasharray  = len;
    el.style.strokeDashoffset = len;
    el.style.transition = 'none';
    const t = setTimeout(() => {
      el.style.transition    = `stroke-dashoffset ${duration}ms ease`;
      el.style.strokeDashoffset = fill !== 'none' ? len : 0;
    }, delay);
    return () => clearTimeout(t);
  }, [d, duration, delay, fill]);

  return (
    <path
      ref={ref}
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Underline({ lineIdx, textLen, color }) {
  const y  = PAD_T + lineIdx * LINE_H + LINE_H - 5;
  const x1 = PAD_L;
  const x2 = PAD_L + textLen * CHAR_W;
  return <AnimatedPath d={`M${x1},${y} L${x2},${y}`} color={color} duration={400} strokeWidth={2} />;
}

function Circle({ lineIdx, textLen, color }) {
  const cx = PAD_L + (textLen / 2) * CHAR_W;
  const cy = PAD_T + lineIdx * LINE_H + LINE_H / 2;
  const rx = Math.max((textLen * CHAR_W) / 2 + 10, 20);
  const ry = LINE_H / 2 + 5;
  // Ellipse as path so we can animate stroke-dashoffset
  const d = [
    `M ${cx - rx} ${cy}`,
    `A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`,
    `A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy}`,
  ].join(' ');
  return <AnimatedPath d={d} color={color} strokeWidth={2} duration={700} />;
}

function Arrow({ from, to, color }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // Control point offset for a slight curve
  const mx = from.x + dx * 0.5 + dy * 0.2;
  const my = from.y + dy * 0.5 - dx * 0.1;
  const d = `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;
  return (
    <g>
      <defs>
        <marker id={`ah-${color.replace('#','')}`} markerWidth="7" markerHeight="7"
          refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill={color} />
        </marker>
      </defs>
      <AnimatedPath
        d={d}
        color={color}
        strokeWidth={2}
        duration={500}
      />
    </g>
  );
}

function Box({ lineIdx, textLen, color }) {
  const x  = PAD_L - 6;
  const y  = PAD_T + lineIdx * LINE_H - 2;
  const w  = textLen * CHAR_W + 12;
  const h  = LINE_H + 2;
  const r  = 5;
  const d = `M${x+r},${y} H${x+w-r} A${r},${r} 0 0 1 ${x+w},${y+r} V${y+h-r} A${r},${r} 0 0 1 ${x+w-r},${y+h} H${x+r} A${r},${r} 0 0 1 ${x},${y+h-r} V${y+r} A${r},${r} 0 0 1 ${x+r},${y}`;
  return <AnimatedPath d={d} color={color} strokeWidth={2} duration={600} fill="none" />;
}

export default function GestureOverlay({ gestures }) {
  return (
    <svg
      className="gesture-overlay"
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'visible',
      }}
    >
      {gestures.map((g, i) => {
        if (g.kind === 'underline') return <Underline key={i} {...g} />;
        if (g.kind === 'circle')    return <Circle    key={i} {...g} />;
        if (g.kind === 'arrow')     return <Arrow     key={i} {...g} />;
        if (g.kind === 'box')       return <Box       key={i} {...g} />;
        return null;
      })}
    </svg>
  );
}
