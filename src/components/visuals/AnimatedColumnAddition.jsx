import { useState, useEffect } from "react";

// Demo: 28 + 35 = 63
const A_TENS = 2, A_ONES = 8;
const B_TENS = 3, B_ONES = 5;
const ONES_SUM = 13;  // 8+5
const ONES_DIGIT = 3; // write this in ones place
const CARRY = 1;
const TENS_DIGIT = 6; // 2+3+1
const ANS = 63;

const STAGES = [
  { ms: 2200, caption: "Write the numbers in columns — tens and ones" },
  { ms: 3500, caption: `Ones column: ${A_ONES} + ${B_ONES} = ${ONES_SUM} → write ${ONES_DIGIT}, carry ${CARRY}` },
  { ms: 3500, caption: `Tens column: ${A_TENS} + ${B_TENS} + ${CARRY} (carry) = ${TENS_DIGIT}` },
  { ms: 0,    caption: `28 + 35 = ${ANS} ✓` },
];

export default function AnimatedColumnAddition({ color = "#6366f1" }) {
  const [stage, setStage] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (STAGES[stage].ms > 0) {
      const t = setTimeout(() => setStage(s => s + 1), STAGES[stage].ms);
      return () => clearTimeout(t);
    }
  }, [stage, animKey]);

  function replay() {
    setStage(0);
    setAnimKey(k => k + 1);
  }

  const onesActive = stage === 1;
  const tensActive = stage >= 2;
  const showCarry  = stage >= 1;
  const showOnesAns = stage >= 1;
  const showTensAns = stage >= 2;
  const done = stage === 3;

  const numSz = { fontSize: 30, fontWeight: 700, color: "#1e293b", fontFamily: "'Fredoka', sans-serif" };

  function cell(digit, highlight, animIn = false) {
    return (
      <div style={{
        width: 44, height: 44,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 8,
        background: highlight ? `${color}1a` : "transparent",
        transition: "background 0.45s ease",
        ...numSz,
        ...(animIn ? { animation: "colPop 0.4s ease-out", opacity: 1 } : {}),
      }}>
        {digit}
      </div>
    );
  }

  return (
    <div key={animKey} style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <style>{`
        @keyframes colPop {
          0%   { transform: scale(0) translateY(4px); opacity: 0; }
          75%  { transform: scale(1.12) translateY(-1px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes carryIn {
          0%   { transform: translateY(14px) scale(0.6); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 transparent; }
          50%       { box-shadow: 0 0 0 6px ${color}22; }
        }
      `}</style>

      {/* Caption */}
      <div style={{
        textAlign: "center", fontSize: 13, color: "#64748b",
        marginBottom: 20, minHeight: 36, fontWeight: 500, lineHeight: 1.4,
        animation: "fadeSlideUp 0.35s ease-out",
      }}>
        {STAGES[stage].caption}
      </div>

      {/* Column grid */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 2 }}>

          {/* Column headers */}
          <div style={{ display: "flex", gap: 0, marginBottom: 2 }}>
            <div style={{ width: 44, textAlign: "center", fontSize: 11, fontWeight: 600, color: "#f59e0b", letterSpacing: 1 }}>H</div>
            <div style={{ width: 30 }} /> {/* sign spacer */}
            <div style={{ width: 44, textAlign: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 1 }}>T</div>
            <div style={{ width: 44, textAlign: "center", fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 1 }}>O</div>
          </div>

          {/* Carry row — carry sits in the H (hundreds) column, left of T */}
          <div style={{ display: "flex", gap: 0, minHeight: 28, alignItems: "center" }}>
            <div style={{ width: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {showCarry && (
                <span style={{
                  fontSize: 18, fontWeight: 700, color: "#f59e0b",
                  animation: "carryIn 0.4s ease-out",
                }}>
                  {CARRY}
                </span>
              )}
            </div>
            <div style={{ width: 30 }} />
            <div style={{ width: 44 }} />
            <div style={{ width: 44 }} />
          </div>

          {/* Row A: 28 */}
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <div style={{ width: 44 }} /> {/* H spacer */}
            <div style={{ width: 30 }} />
            {cell(A_TENS, tensActive)}
            {cell(A_ONES, onesActive)}
          </div>

          {/* Row B: +35 */}
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <div style={{ width: 44 }} /> {/* H spacer */}
            <div style={{ width: 30, textAlign: "right", paddingRight: 4, ...numSz, color, fontSize: 24 }}>+</div>
            {cell(B_TENS, tensActive)}
            {cell(B_ONES, onesActive)}
          </div>

          {/* Divider */}
          <div style={{ height: 3, background: "#1e293b", borderRadius: 2, margin: "4px 0 4px 74px" }} />

          {/* Answer row */}
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <div style={{ width: 44 }} /> {/* H spacer */}
            <div style={{ width: 30 }} />

            {/* Tens answer */}
            {showTensAns ? (
              <div style={{
                width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, background: `${color}15`,
                ...numSz, color,
                animation: "colPop 0.4s ease-out",
              }}>
                {TENS_DIGIT}
              </div>
            ) : (
              <div style={{ width: 44, height: 44 }} />
            )}

            {/* Ones answer */}
            {showOnesAns ? (
              <div style={{
                width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, background: `${color}15`,
                ...numSz, color,
                animation: "colPop 0.4s ease-out",
              }}>
                {ONES_DIGIT}
              </div>
            ) : (
              <div style={{ width: 44, height: 44 }} />
            )}
          </div>
        </div>
      </div>

      {/* Working-out box */}
      {stage >= 1 && (
        <div style={{
          marginTop: 18, padding: "12px 16px",
          background: `${color}0a`, borderRadius: 14,
          border: `1.5px solid ${color}22`,
          animation: "fadeSlideUp 0.4s ease-out",
          textAlign: "center",
        }}>
          {stage === 1 && (
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>
              {A_ONES} + {B_ONES} = {ONES_SUM}&nbsp;&nbsp;→&nbsp;&nbsp;
              write <span style={{ color, fontWeight: 700 }}>{ONES_DIGIT}</span>,&nbsp;
              carry <span style={{ color: "#f59e0b", fontWeight: 700 }}>{CARRY}</span>
            </div>
          )}
          {stage >= 2 && (
            <div style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>
              {A_TENS} + {B_TENS} + <span style={{ color: "#f59e0b", fontWeight: 700 }}>{CARRY}</span>{" "}
              <span style={{ color: "#94a3b8", fontSize: 12 }}>(carry)</span> ={" "}
              <span style={{ color, fontWeight: 700 }}>{TENS_DIGIT}</span>
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {done && (
        <div style={{ textAlign: "center", marginTop: 20, animation: "fadeSlideUp 0.4s ease-out" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color, marginBottom: 12 }}>
            28 + 35 = {ANS} ✓
          </div>
          <button
            onClick={replay}
            style={{
              padding: "8px 24px", borderRadius: 20,
              border: `2px solid ${color}`, background: "transparent",
              color, fontSize: 14, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Fredoka', sans-serif",
            }}
          >
            ▶ Watch again
          </button>
        </div>
      )}
    </div>
  );
}
