import { useState, useEffect } from "react";

const STAGES = [
  {
    duration: 2000,
    caption: "3 groups of 4",
    groupsVisible: 0,
    total: 0,
  },
  {
    duration: 2500,
    caption: "Group 1: 4 dots",
    groupsVisible: 1,
    total: 4,
  },
  {
    duration: 2500,
    caption: "Group 2: 4 more dots... (8 so far)",
    groupsVisible: 2,
    total: 8,
  },
  {
    duration: 2500,
    caption: "Group 3: 4 more dots...",
    groupsVisible: 3,
    total: 12,
  },
  {
    duration: 0,
    caption: "3 × 4 = 12 ✓",
    groupsVisible: 3,
    total: 12,
  },
];

const KEYFRAMES = `
  @keyframes groupPop {
    0%   { transform: scale(0); opacity: 0; }
    75%  { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes fadeSlideUp {
    0%   { opacity: 0; transform: translateY(8px); }
    100% { opacity: 1; transform: translateY(0); }
  }
`;

function Dot({ color, delayMs }) {
  return (
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: color,
        animation: `groupPop 0.4s ease forwards`,
        animationDelay: `${delayMs}ms`,
        transform: "scale(0)",
        opacity: 0,
      }}
    />
  );
}

function GroupBox({ groupIndex, visible, color, isNew }) {
  const label = `Group ${groupIndex + 1}`;

  if (!visible) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderRadius: 12,
          border: "2px dashed #d1d5db",
          backgroundColor: "#f9fafb",
          minWidth: 120,
          minHeight: 72,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 13,
            color: "#9ca3af",
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </div>
    );
  }

  const bgColors = ["#fef3c7", "#dbeafe", "#dcfce7"];
  const bg = bgColors[groupIndex % bgColors.length];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: 12,
        border: `2px solid ${color}`,
        backgroundColor: bg,
        minWidth: 120,
        animation: isNew ? "fadeSlideUp 0.35s ease forwards" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: 13,
          color: "#374151",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 6,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 100,
        }}
      >
        {Array.from({ length: 4 }).map((_, dotIndex) => (
          <Dot
            key={dotIndex}
            color={color}
            delayMs={isNew ? dotIndex * 80 : 0}
          />
        ))}
      </div>
    </div>
  );
}

function AnimatedMultiplicationInner({ color }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length - 1) return;
    const duration = STAGES[stage].duration;
    const timer = setTimeout(() => {
      setStage((s) => s + 1);
    }, duration);
    return () => clearTimeout(timer);
  }, [stage]);

  const currentStage = STAGES[stage];
  const isFinal = stage === STAGES.length - 1;

  return (
    <div
      style={{
        fontFamily: "'Fredoka', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        padding: "28px 24px",
        maxWidth: 420,
        margin: "0 auto",
        userSelect: "none",
      }}
    >
      {/* Caption */}
      <div
        key={`caption-${stage}`}
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#1f2937",
          textAlign: "center",
          animation: "fadeSlideUp 0.35s ease forwards",
          minHeight: 28,
        }}
      >
        {currentStage.caption}
      </div>

      {/* Groups grid */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        {Array.from({ length: 3 }).map((_, groupIndex) => {
          const visible = groupIndex < currentStage.groupsVisible;
          const prevVisible =
            stage > 0
              ? groupIndex < STAGES[stage - 1].groupsVisible
              : false;
          const isNew = visible && !prevVisible;
          return (
            <GroupBox
              key={groupIndex}
              groupIndex={groupIndex}
              visible={visible}
              color={color}
              isNew={isNew}
            />
          );
        })}
      </div>

      {/* Running total */}
      {currentStage.total > 0 && (
        <div
          key={`total-${stage}`}
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#6b7280",
            animation: "fadeSlideUp 0.35s ease forwards",
          }}
        >
          Total so far:{" "}
          <span style={{ color: color, fontSize: 20 }}>
            {currentStage.total}
          </span>
        </div>
      )}

      {/* Final equation */}
      {isFinal && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            animation: "fadeSlideUp 0.4s ease forwards",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: color,
              letterSpacing: 1,
            }}
          >
            3 × 4 = 12 ✓
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnimatedMultiplication({ color = "#f59e0b" }) {
  const [replayKey, setReplayKey] = useState(0);
  const [showReplay, setShowReplay] = useState(false);

  // Total duration before final stage: 0+1200+1200+1200+1200 = 4800ms
  useEffect(() => {
    const totalDuration = STAGES.slice(0, -1).reduce(
      (sum, s) => sum + s.duration,
      0
    );
    const timer = setTimeout(() => setShowReplay(true), totalDuration);
    return () => clearTimeout(timer);
  }, [replayKey]);

  const handleReplay = () => {
    setShowReplay(false);
    setReplayKey((k) => k + 1);
  };

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div>
        <AnimatedMultiplicationInner key={replayKey} color={color} />
        {showReplay && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: 16,
              animation: "fadeSlideUp 0.35s ease forwards",
            }}
          >
            <button
              onClick={handleReplay}
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#ffffff",
                backgroundColor: color,
                border: "none",
                borderRadius: 10,
                padding: "8px 22px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Watch again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
