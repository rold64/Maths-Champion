import { timeLabel } from "../../utils/generateProblem.js";

// Analog clock face SVG
export default function ClockFace({ hours, minutes, color, size = 160, showLabel = true, highlightHand = null }) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 8;

  // Angles (0° = 12 o'clock, clockwise)
  const minuteAngle = minutes * 6 - 90;               // deg from 3 o'clock → subtract 90
  const hourAngle   = (hours % 12) * 30 + minutes * 0.5 - 90;

  function handEnd(angleDeg, length) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + length * Math.cos(rad),
      y: cy + length * Math.sin(rad),
    };
  }

  const minEnd  = handEnd(minuteAngle, r * 0.82);
  const hourEnd = handEnd(hourAngle, r * 0.56);

  const minuteColor = highlightHand === "minute" ? "#e11d48" : (color || "#0284c7");
  const hourColor   = highlightHand === "hour"   ? "#e11d48" : (color || "#1e293b");

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, marginBottom:12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Clock face */}
        <circle cx={cx} cy={cy} r={r} fill="white" stroke="#e2e8f0" strokeWidth="3" />

        {/* Hour markers + numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const n    = i + 1;
          const ang  = n * 30 - 90;
          const rad  = (ang * Math.PI) / 180;
          const tx   = cx + (r - 16) * Math.cos(rad);
          const ty   = cy + (r - 16) * Math.sin(rad);
          const mx   = cx + (r - 6) * Math.cos(rad);
          const my   = cy + (r - 6) * Math.sin(rad);
          const mx2  = cx + (r - 1) * Math.cos(rad);
          const my2  = cy + (r - 1) * Math.sin(rad);
          return (
            <g key={n}>
              <line x1={mx} y1={my} x2={mx2} y2={my2} stroke="#94a3b8" strokeWidth="2" />
              <text x={tx} y={ty + 4} textAnchor="middle"
                fontFamily="Fredoka, sans-serif" fontSize={size < 120 ? 10 : 13}
                fontWeight="600" fill="#334155">{n}</text>
            </g>
          );
        })}

        {/* Minute tick marks (60 total, smaller) */}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 === 0) return null; // already drawn as hour markers
          const ang  = i * 6 - 90;
          const rad  = (ang * Math.PI) / 180;
          const mx   = cx + (r - 4) * Math.cos(rad);
          const my   = cy + (r - 4) * Math.sin(rad);
          const mx2  = cx + (r - 1) * Math.cos(rad);
          const my2  = cy + (r - 1) * Math.sin(rad);
          return <line key={i} x1={mx} y1={my} x2={mx2} y2={my2} stroke="#cbd5e1" strokeWidth="1" />;
        })}

        {/* Hour hand */}
        <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y}
          stroke={hourColor} strokeWidth={size < 120 ? 4 : 6}
          strokeLinecap="round"
          style={{ filter: highlightHand === "hour" ? `drop-shadow(0 0 4px ${hourColor})` : "none" }}
        />

        {/* Minute hand */}
        <line x1={cx} y1={cy} x2={minEnd.x} y2={minEnd.y}
          stroke={minuteColor} strokeWidth={size < 120 ? 3 : 4}
          strokeLinecap="round"
          style={{ filter: highlightHand === "minute" ? `drop-shadow(0 0 4px ${minuteColor})` : "none" }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="5" fill="#334155" />
        <circle cx={cx} cy={cy} r="3" fill="white" />
      </svg>

      {showLabel && (
        <div style={{
          fontFamily:"'Fredoka', sans-serif", fontSize:15, fontWeight:600, color:"#64748b",
          background:"rgba(255,255,255,0.7)", borderRadius:10, padding:"4px 12px",
        }}>
          {timeLabel(hours, minutes)}
        </div>
      )}
    </div>
  );
}
