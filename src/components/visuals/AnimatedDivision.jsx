import { useState, useEffect } from "react";

// Fixed demo: 12 ÷ 3 = 4
const TOTAL = 12;
const GROUPS = 3;
const ANSWER = 4; // TOTAL / GROUPS

// Stages: index 0 is setup, indices 1–4 are distribution rounds, index 5 is done
// Each entry: delay in ms before auto-advancing (0 = stay until user acts), caption
const STAGES = [
  { ms: 2000, caption: `Share ${TOTAL} into ${GROUPS} groups` },
  { ms: 2500, caption: "Round 1: 1 each..." },
  { ms: 2500, caption: "Round 2: 2 each..." },
  { ms: 2500, caption: "Round 3: 3 each..." },
  { ms: 2500, caption: "Round 4: 4 each!" },
  { ms: 0,    caption: `${TOTAL} ÷ ${GROUPS} = ${ANSWER} ✓` },
];

// At stage N (0-indexed), each group has received (N) dots (stage 0 = 0 dots distributed)
function dotsPerGroup(stage) {
  return Math.min(stage, ANSWER);
}

function poolRemaining(stage) {
  return TOTAL - dotsPerGroup(stage) * GROUPS;
}

function Dot({ color, animated, delay = 0 }) {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
        animation: animated
          ? `dotIn 0.35s ${delay}ms cubic-bezier(0.34,1.56,0.64,1) both`
          : "none",
      }}
    />
  );
}

function GroupBox({ index, dotCount, color, stageKey }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.85)",
        borderRadius: 14,
        padding: "10px 14px",
        boxShadow: `0 2px 10px ${color}22`,
        border: `2px solid ${color}33`,
        minWidth: 80,
        minHeight: 90,
      }}
    >
      <span
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "#94a3b8",
        }}
      >
        Group {index + 1}
      </span>

      {/* Dot grid inside group */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          justifyContent: "center",
          flex: 1,
          alignContent: "flex-start",
        }}
      >
        {Array.from({ length: dotCount }).map((_, i) => (
          // Animate only the newest dot (the last one added at this stage)
          <Dot
            key={`${stageKey}-g${index}-d${i}`}
            color={color}
            animated={i === dotCount - 1 && dotCount > 0}
            delay={index * 80}
          />
        ))}
      </div>

      {/* Count label */}
      <span
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 16,
          fontWeight: 700,
          color: dotCount > 0 ? color : "#cbd5e1",
        }}
      >
        {dotCount}
      </span>
    </div>
  );
}

export default function AnimatedDivision({ color = "#10b981" }) {
  const [stage, setStage] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const { ms } = STAGES[stage];
    if (!ms) return;
    const t = setTimeout(() => setStage((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [stage, key]);

  function replay() {
    setStage(0);
    setKey((k) => k + 1);
  }

  const isDone = stage === STAGES.length - 1;
  const groupDots = dotsPerGroup(stage);
  const poolDots = poolRemaining(stage);

  return (
    <div
      key={key}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <style>{`
        @keyframes dotIn {
          0%   { transform: scale(0);    opacity: 0; }
          70%  { transform: scale(1.1);  opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      {/* Caption */}
      <div
        key={`cap-${stage}`}
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: isDone ? 20 : 15,
          fontWeight: isDone ? 700 : 500,
          color: isDone ? color : "#64748b",
          animation: "fadeSlideUp 0.4s ease-out both",
          minHeight: 24,
          textAlign: "center",
        }}
      >
        {STAGES[stage].caption}
      </div>

      {/* Pool area */}
      <div
        style={{
          background: "rgba(255,255,255,0.75)",
          borderRadius: 14,
          padding: "10px 16px",
          boxShadow: `0 2px 12px ${color}22`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          width: "100%",
          maxWidth: 280,
        }}
      >
        <span
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#94a3b8",
          }}
        >
          Pool ({poolDots} left)
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 5,
            justifyContent: "center",
            minHeight: 20,
          }}
        >
          {Array.from({ length: poolDots }).map((_, i) => (
            <Dot key={`pool-${stage}-${i}`} color={color} animated={false} />
          ))}
        </div>
      </div>

      {/* Group boxes */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {Array.from({ length: GROUPS }).map((_, i) => (
          <GroupBox
            key={i}
            index={i}
            dotCount={groupDots}
            color={color}
            stageKey={stage}
          />
        ))}
      </div>

      {/* Final equation */}
      {isDone && (
        <div
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color,
            display: "flex",
            gap: 10,
            alignItems: "center",
            animation: "fadeSlideUp 0.5s ease-out both",
          }}
        >
          <span>{TOTAL}</span>
          <span style={{ color: "#94a3b8" }}>÷</span>
          <span>{GROUPS}</span>
          <span style={{ color: "#94a3b8" }}>=</span>
          <span
            style={{
              background: `${color}18`,
              borderRadius: 12,
              padding: "2px 14px",
              animation: "popIn 0.4s 0.2s ease-out both",
            }}
          >
            {ANSWER}
          </span>
          <span style={{ fontSize: 22 }}>✓</span>
        </div>
      )}

      {/* Watch again button */}
      {isDone && (
        <button
          onClick={replay}
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "white",
            background: color,
            border: "none",
            borderRadius: 20,
            padding: "7px 20px",
            cursor: "pointer",
            opacity: 0,
            animation: "fadeSlideUp 0.4s 0.6s ease-out forwards",
            boxShadow: `0 2px 8px ${color}44`,
          }}
        >
          ▶ Watch again
        </button>
      )}
    </div>
  );
}
