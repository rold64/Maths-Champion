import { useState, useEffect } from "react";

// Fixed demo: fact family for 3, 5, 8
const PART_A = 3, PART_B = 5, TOTAL = 8;

const colorA = "#6366f1"; // indigo
const colorB = "#0ea5e9"; // sky

const STAGES = [
  { ms: 2200, caption: `Meet the family: ${PART_A}, ${PART_B} and ${TOTAL}` },
  { ms: 2800, caption: `${PART_A} + ${PART_B} = ${TOTAL}` },
  { ms: 2800, caption: `${PART_B} + ${PART_A} = ${TOTAL} (order doesn't matter!)` },
  { ms: 2800, caption: `${TOTAL} \u2212 ${PART_B} = ${PART_A}` },
  { ms: 2800, caption: `${TOTAL} \u2212 ${PART_A} = ${PART_B}` },
  { ms: 0,    caption: "One family, four facts! \u2713" },
];

const equations = [
  { label: `${PART_A} + ${PART_B} = ${TOTAL}`, color: colorA, activeFrom: 1 },
  { label: `${PART_B} + ${PART_A} = ${TOTAL}`, color: colorA, activeFrom: 2 },
  { label: `${TOTAL} \u2212 ${PART_B} = ${PART_A}`, color: colorB, activeFrom: 3 },
  { label: `${TOTAL} \u2212 ${PART_A} = ${PART_B}`, color: colorB, activeFrom: 4 },
];

// SVG triangle vertices: total at top, parts at bottom-left and bottom-right
const TRI = {
  top:         { cx: 100, cy: 18 },
  bottomLeft:  { cx: 16,  cy: 148 },
  bottomRight: { cx: 184, cy: 148 },
};

export default function AnimatedAddSubFamily({ color = "#6366f1" }) {
  const [stage, setStage] = useState(0);
  const [key,   setKey]   = useState(0);

  useEffect(() => {
    const { ms } = STAGES[stage];
    if (!ms) return;
    const t = setTimeout(() => setStage(s => s + 1), ms);
    return () => clearTimeout(t);
  }, [stage, key]);

  function replay() {
    setStage(0);
    setKey(k => k + 1);
  }

  const s = (n) => stage >= n;

  // Which edge to highlight: top-left edge (colorA) for stages 1-2, top-right edge (colorB) for stages 3-4
  const highlightLeft  = stage === 1 || stage === 2;
  const highlightRight = stage === 3 || stage === 4;

  return (
    <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "'Fredoka', sans-serif" }}>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawTriangle {
          from { stroke-dashoffset: 700; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nodeAppear {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Caption */}
      <div
        key={`cap-${stage}`}
        style={{
          fontSize: stage === 5 ? 18 : 15,
          fontWeight: stage === 5 ? 700 : 500,
          color: stage === 5 ? colorA : "#64748b",
          animation: "fadeSlideUp 0.4s ease-out both",
          minHeight: 24,
          textAlign: "center",
          maxWidth: 280,
        }}
      >
        {STAGES[stage].caption}
      </div>

      {/* SVG Triangle */}
      <div style={{
        background: "rgba(255,255,255,0.85)",
        borderRadius: 16,
        padding: "12px 16px",
        boxShadow: `0 2px 16px ${colorA}22`,
      }}>
        <svg width="200" height="168" viewBox="0 0 200 168" style={{ overflow: "visible" }}>

          {/* Triangle fill */}
          <polygon
            points={`${TRI.top.cx},${TRI.top.cy} ${TRI.bottomLeft.cx},${TRI.bottomLeft.cy} ${TRI.bottomRight.cx},${TRI.bottomRight.cy}`}
            fill={`${colorA}08`}
            stroke="none"
          />

          {/* Top-left edge (colorA): total → part A */}
          <line
            x1={TRI.top.cx} y1={TRI.top.cy}
            x2={TRI.bottomLeft.cx} y2={TRI.bottomLeft.cy}
            stroke={highlightLeft ? colorA : "#cbd5e1"}
            strokeWidth={highlightLeft ? 3.5 : 2.5}
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
          />

          {/* Top-right edge (colorB): total → part B */}
          <line
            x1={TRI.top.cx} y1={TRI.top.cy}
            x2={TRI.bottomRight.cx} y2={TRI.bottomRight.cy}
            stroke={highlightRight ? colorB : "#cbd5e1"}
            strokeWidth={highlightRight ? 3.5 : 2.5}
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
          />

          {/* Bottom edge */}
          <line
            x1={TRI.bottomLeft.cx} y1={TRI.bottomLeft.cy}
            x2={TRI.bottomRight.cx} y2={TRI.bottomRight.cy}
            stroke="#cbd5e1"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Edge operator labels */}
          <text
            x="48" y="88"
            textAnchor="middle"
            fontFamily="Fredoka, sans-serif"
            fontSize="15"
            fontWeight="600"
            fill={highlightLeft ? colorA : "#94a3b8"}
            style={{ transition: "fill 0.3s" }}
          >+</text>
          <text
            x="152" y="88"
            textAnchor="middle"
            fontFamily="Fredoka, sans-serif"
            fontSize="15"
            fontWeight="600"
            fill={highlightRight ? colorB : "#94a3b8"}
            style={{ transition: "fill 0.3s" }}
          >{"−"}</text>

          {/* Top vertex — TOTAL (8) */}
          {s(0) && (
            <g style={{ animation: "nodeAppear 0.5s 0.3s ease-out both", transformOrigin: `${TRI.top.cx}px ${TRI.top.cy}px` }}>
              <circle cx={TRI.top.cx} cy={TRI.top.cy} r="18" fill="white" stroke={colorA} strokeWidth="2.5" />
              <text x={TRI.top.cx} y={TRI.top.cy + 6} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill={colorA}>{TOTAL}</text>
            </g>
          )}

          {/* Bottom-left vertex — PART_A (3) */}
          {s(0) && (
            <g style={{ animation: "nodeAppear 0.5s 0.5s ease-out both", transformOrigin: `${TRI.bottomLeft.cx}px ${TRI.bottomLeft.cy}px` }}>
              <circle cx={TRI.bottomLeft.cx} cy={TRI.bottomLeft.cy} r="16" fill="white" stroke={colorB} strokeWidth="2.5" />
              <text x={TRI.bottomLeft.cx} y={TRI.bottomLeft.cy + 6} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="700" fill={colorB}>{PART_A}</text>
            </g>
          )}

          {/* Bottom-right vertex — PART_B (5) */}
          {s(0) && (
            <g style={{ animation: "nodeAppear 0.5s 0.7s ease-out both", transformOrigin: `${TRI.bottomRight.cx}px ${TRI.bottomRight.cy}px` }}>
              <circle cx={TRI.bottomRight.cx} cy={TRI.bottomRight.cy} r="16" fill="white" stroke={colorB} strokeWidth="2.5" />
              <text x={TRI.bottomRight.cx} y={TRI.bottomRight.cy + 6} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="700" fill={colorB}>{PART_B}</text>
            </g>
          )}

        </svg>
      </div>

      {/* Equations — shown individually during stages 1-4, all at once in stage 5 */}
      {stage < 5 ? (
        <div style={{ minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {equations.map((eq, i) => {
            if (stage !== eq.activeFrom) return null;
            return (
              <div
                key={`eq-${i}-${stage}`}
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: eq.color,
                  background: `${eq.color}18`,
                  borderRadius: 24,
                  padding: "6px 20px",
                  animation: "popIn 0.4s ease-out both",
                }}
              >
                {eq.label}
              </div>
            );
          })}
        </div>
      ) : (
        /* Stage 5: 2×2 grid of all equations */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            animation: "fadeSlideUp 0.5s ease-out both",
          }}
        >
          {equations.map((eq, i) => (
            <div
              key={`final-eq-${i}`}
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: eq.color,
                background: `${eq.color}18`,
                borderRadius: 20,
                padding: "6px 14px",
                textAlign: "center",
                animation: `popIn 0.4s ${i * 0.1}s ease-out both`,
              }}
            >
              {eq.label}
            </div>
          ))}
        </div>
      )}

      {/* Replay button */}
      {s(5) && (
        <button
          onClick={replay}
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "white",
            background: colorA,
            border: "none",
            borderRadius: 20,
            padding: "7px 20px",
            cursor: "pointer",
            opacity: 0,
            animation: "fadeSlideUp 0.4s 0.6s ease-out forwards",
            boxShadow: `0 2px 8px ${colorA}44`,
          }}
        >
          &#9654; Watch again
        </button>
      )}

    </div>
  );
}
