import { useState, useEffect } from "react";

// Fixed demo: 8 + 5 = 13
const A = 8, B = 5, ANS = 13;

const svgW = 300, svgH = 90, lineY = 58, padL = 20, padR = 20;
const max  = 15; // ANS + 2, gives breathing room
const stepPx = (svgW - padL - padR) / max; // 260/15 ≈ 17.33px

function xOf(n) { return padL + n * stepPx; }

const x1  = xOf(A);
const x2  = xOf(ANS);
const mx  = (x1 + x2) / 2;
const arcH = 28;
const arcPath   = `M ${x1} ${lineY} Q ${mx} ${lineY - arcH} ${x2} ${lineY}`;
const arcMidY   = lineY - arcH / 2;
const arrowPts  = `${mx+6},${arcMidY} ${mx-3},${arcMidY-4} ${mx-3},${arcMidY+4}`;

// Regular tick positions (every 5), plus key positions
const TICKS = [0, 5, 10, 15, A, ANS].filter((v,i,a)=>a.indexOf(v)===i);

// Each stage: how long before auto-advancing (ms), and caption
const STAGES = [
  { ms: 1600, caption: `Start at ${A}` },
  { ms: 2600, caption: `Jump forward ${B}...` },
  { ms: 1800, caption: `...land on ${ANS}!` },
  { ms: 0,    caption: `${A} + ${B} = ${ANS} ✓` },
];

export default function AnimatedAddition({ color = "#6366f1" }) {
  const [stage, setStage] = useState(0);
  const [key,   setKey]   = useState(0); // incremented on replay to reset CSS animations

  // Auto-advance through stages
  useEffect(() => {
    const { ms } = STAGES[stage];
    if (!ms) return; // last stage — wait for user
    const t = setTimeout(() => setStage(s => s + 1), ms);
    return () => clearTimeout(t);
  }, [stage, key]);

  function replay() {
    setStage(0);
    setKey(k => k + 1);
  }

  const s = (n) => stage >= n;

  return (
    <div key={key} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes drawArc    { from { stroke-dashoffset:150 } to { stroke-dashoffset:0 } }
        @keyframes fadeUp2    { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes dotAppear  { from { transform:scale(0); opacity:0 } to { transform:scale(1); opacity:1 } }
        @keyframes dotArrive  { 0% { transform:scale(0); opacity:0 } 70% { transform:scale(1.15); opacity:1 } 100% { transform:scale(1) } }
      `}</style>

      {/* Caption — re-triggers fade on each stage change */}
      <div key={`cap-${stage}`} style={{
        fontFamily:"'Fredoka', sans-serif",
        fontSize: stage === 3 ? 18 : 15,
        fontWeight: stage === 3 ? 700 : 500,
        color: stage === 3 ? color : "#64748b",
        animation:"fadeUp2 0.4s ease-out both",
        minHeight:22, textAlign:"center",
      }}>
        {STAGES[stage].caption}
      </div>

      {/* SVG number line */}
      <div style={{
        background:"rgba(255,255,255,0.75)", borderRadius:14,
        padding:"8px 10px", boxShadow:`0 2px 12px ${color}22`,
      }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>

          {/* Base line */}
          <line x1={padL} y1={lineY} x2={svgW-padR} y2={lineY}
            stroke="#cbd5e1" strokeWidth="2" />

          {/* Ticks and labels */}
          {TICKS.map(n => {
            const x      = xOf(n);
            const isKey  = n === A || n === ANS;
            const showA  = isKey && n === A  && s(0);
            const showB  = isKey && n === ANS && s(2);
            const showReg = !isKey;
            if (!showA && !showB && !showReg) return (
              <line key={n} x1={x} y1={lineY-4} x2={x} y2={lineY+4}
                stroke="#94a3b8" strokeWidth="1" />
            );
            return (
              <g key={n}>
                <line
                  x1={x} y1={lineY-(isKey?7:4)} x2={x} y2={lineY+(isKey?7:4)}
                  stroke={isKey ? color : "#94a3b8"}
                  strokeWidth={isKey ? 2.5 : 1}
                />
                <text x={x} y={lineY+18}
                  textAnchor="middle"
                  fontFamily="Fredoka, sans-serif"
                  fontSize={isKey ? 13 : 10}
                  fontWeight={isKey ? "700" : "400"}
                  fill={isKey ? color : "#94a3b8"}
                  style={isKey ? { animation:"fadeUp2 0.4s ease-out both" } : {}}>
                  {n}
                </text>
              </g>
            );
          })}

          {/* Arc — draws itself when stage ≥ 1 */}
          {s(1) && (
            <path
              d={arcPath} fill="none"
              stroke={color} strokeWidth="2.5"
              strokeDasharray="150" strokeDashoffset="0"
              style={{ animation:"drawArc 1.4s ease-out forwards" }}
            />
          )}

          {/* Mid-arc directional arrowhead — fades in after arc */}
          {s(1) && (
            <polygon points={arrowPts} fill={color}
              style={{ opacity:0, animation:"fadeUp2 0.3s 1.2s ease-out forwards" }}
            />
          )}

          {/* +B label above arc — fades in after arc */}
          {s(1) && (
            <text x={mx} y={lineY - arcH - 6}
              textAnchor="middle"
              fontFamily="Fredoka, sans-serif" fontSize="13" fontWeight="700" fill={color}
              style={{ opacity:0, animation:"fadeUp2 0.4s 1.1s ease-out forwards" }}>
              +{B}
            </text>
          )}

          {/* Start dot — smooth fade in, no bounce */}
          {s(0) && (
            <circle cx={x1} cy={lineY} r="7" fill={color} opacity="0.5"
              style={{ animation:"dotAppear 0.4s ease-out both" }} />
          )}

          {/* End dot — slight overshoot on arrival (intentional "landing" feel) */}
          {s(2) && (
            <circle cx={x2} cy={lineY} r="7" fill={color}
              style={{ animation:"dotArrive 0.5s ease-out both" }} />
          )}

        </svg>
      </div>

      {/* Equation reveal */}
      {s(3) && (
        <div style={{
          fontFamily:"'Fredoka', sans-serif", fontSize:30, fontWeight:700,
          color, animation:"fadeUp2 0.5s ease-out both",
          display:"flex", gap:10, alignItems:"center",
        }}>
          <span>{A}</span>
          <span style={{ color:"#94a3b8" }}>+</span>
          <span>{B}</span>
          <span style={{ color:"#94a3b8" }}>=</span>
          <span style={{
            background:`${color}18`, borderRadius:12, padding:"2px 14px",
            animation:"popIn 0.4s 0.2s ease-out both",
          }}>{ANS}</span>
        </div>
      )}

      {/* Replay button */}
      {s(3) && (
        <button onClick={replay} style={{
          fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:600,
          color:"white", background:color, border:"none",
          borderRadius:20, padding:"7px 20px", cursor:"pointer",
          opacity:0, animation:"fadeUp2 0.4s 0.6s ease-out forwards",
          boxShadow:`0 2px 8px ${color}44`,
        }}>
          ▶ Watch again
        </button>
      )}

    </div>
  );
}
