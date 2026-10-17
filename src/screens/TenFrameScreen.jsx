import { useEffect, useState } from "react";
import TenFrameBoard from "../components/TenFrameBoard.jsx";
import SoundEngine from "../sounds/SoundEngine.js";
import { LEVELS } from "../data/levels.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildFilled(count) {
  return Array.from({ length: count }, (_, index) => index);
}

function buildChallenge(type, level = "starter") {
  const levelFactor = level === "starter" ? 5 : level === "explorer" ? 8 : level === "champion" ? 10 : 10;

  switch (type) {
    case "count": {
      const target = randomInt(1, Math.min(10, levelFactor));
      return {
        type,
        prompt: `Build ${target} on the frame`,
        target,
        helper: "Tap the dots to match the number."
      };
    }
    case "subitize": {
      const target = randomInt(1, Math.min(10, levelFactor));
      return {
        type,
        prompt: "Look, then build the same number",
        target,
        preview: buildFilled(target),
        helper: "Quick image: look at the frame, then make the same number."
      };
    }
    case "addition": {
      const a = randomInt(1, Math.min(5, levelFactor));
      const b = randomInt(1, Math.min(5, levelFactor));
      return {
        type,
        prompt: `Make ${a + b} in total`,
        left: a,
        right: b,
        total: a + b,
        helper: `Build the total from ${a} and ${b}.`
      };
    }
    case "make10": {
      const start = randomInt(1, 9);
      return {
        type,
        prompt: `${start} + ? = 10`,
        start,
        target: 10,
        missing: 10 - start,
        helper: "Add the missing counters to make 10."
      };
    }
    case "compare": {
      const left = randomInt(1, Math.min(10, levelFactor));
      let right = left;
      while (right === left) {
        right = randomInt(1, Math.min(10, levelFactor));
      }
      const answer = left > right ? "left" : "right";
      return {
        type,
        prompt: "Which frame has more?",
        left,
        right,
        answer,
        helper: "Tap the frame that has more counters."
      };
    }
    case "numberbond": {
      const whole = randomInt(4, Math.min(10, levelFactor + 2));
      const partA = randomInt(1, whole - 1);
      const partB = whole - partA;
      const missing = Math.random() < 0.5 ? partA : partB;
      const answer = whole - missing;
      return {
        type,
        prompt: `If the whole is ${whole}, what is the missing part?`,
        whole,
        given: missing,
        answer,
        helper: "Use the frame to build the missing part."
      };
    }
    default:
      return buildChallenge("count", level);
  }
}

export default function TenFrameScreen({ opId, levelIdx, onHome, onLevelSelect }) {
  const levels = LEVELS[opId] || [];
  const level = levels[levelIdx] || levels[0] || { name: "Starter", label: "0–10" };
  const [activityType, setActivityType] = useState("count");
  const [challenge, setChallenge] = useState(() => buildChallenge("count", level.name.toLowerCase()));
  const [boardA, setBoardA] = useState([]);
  const [boardB, setBoardB] = useState([]);
  const [boardC, setBoardC] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showPreview, setShowPreview] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const activityTypes = [
    { id: "count", label: "Count", emoji: "🔢" },
    { id: "subitize", label: "Subitize", emoji: "✨" },
    { id: "addition", label: "Add", emoji: "➕" },
    { id: "make10", label: "Make 10", emoji: "🎯" },
    { id: "numberbond", label: "Bonds", emoji: "🔗" },
    { id: "compare", label: "Compare", emoji: "⚖️" },
  ];

  function resetActivity(type = activityType) {
    const next = buildChallenge(type, level.name.toLowerCase());
    setChallenge(next);
    setBoardA(type === "subitize" ? [] : type === "make10" ? buildFilled(next.start) : []);
    setBoardB([]);
    setBoardC([]);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowPreview(type === "subitize");
  }

  function switchActivity(type) {
    setActivityType(type);
    resetActivity(type);
    SoundEngine.navigate();
  }

  useEffect(() => {
    if (activityType === "subitize" && showPreview) {
      const timer = setTimeout(() => setShowPreview(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [activityType, challenge, showPreview]);

  function handleSubmit() {
    if (feedback) return;

    let isCorrect = false;
    if (activityType === "count") isCorrect = boardA.length === challenge.target;
    if (activityType === "subitize") isCorrect = boardA.length === challenge.target;
    if (activityType === "addition") {
      isCorrect = boardB.length === challenge.left
        && boardC.length === challenge.right
        && boardA.length === challenge.total;
    }
    if (activityType === "make10") isCorrect = boardA.length === 10;
    if (activityType === "numberbond") isCorrect = boardA.length === challenge.answer;
    if (activityType === "compare") isCorrect = selectedAnswer === challenge.answer;

    if (isCorrect) {
      SoundEngine.correct();
      setFeedback("correct");
      setScore(prev => prev + 1);
    } else {
      SoundEngine.wrong();
      setFeedback("wrong");
    }
  }

  function clearActivity() {
    setBoardA(activityType === "make10" ? buildFilled(challenge.start) : []);
    setBoardB([]);
    setBoardC([]);
    setSelectedAnswer(null);
    setFeedback(null);
  }

  const hasClearableInput = activityType === "compare"
    ? selectedAnswer !== null
    : activityType === "addition"
      ? boardA.length > 0 || boardB.length > 0 || boardC.length > 0
    : activityType === "make10"
      ? boardA.length > challenge.start
      : boardA.length > 0;

  function nextChallenge() {
    const nextRound = round + 1;
    setRound(nextRound);
    setChallenge(buildChallenge(activityType, level.name.toLowerCase()));
    setBoardA(activityType === "make10" ? buildFilled(Math.max(1, randomInt(1, 9))) : []);
    setBoardB([]);
    setBoardC([]);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowPreview(activityType === "subitize");
  }

  function renderBoardPreview() {
    if (activityType === "subitize" && showPreview) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Quick image</div>
          <TenFrameBoard filled={challenge.preview || []} color="#14b8a6" secondaryColor="#2dd4bf" disabled size={42} showValue={false} quickAdd={false} />
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Look carefully — now build the same number.</div>
        </div>
      );
    }

    if (activityType === "count") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.prompt}</div>
          <TenFrameBoard filled={boardA} onChange={setBoardA} color="#14b8a6" secondaryColor="#2dd4bf" size={42} showValue={false} quickAdd={false} />
        </div>
      );
    }

    if (activityType === "subitize") {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.prompt}</div>
          <TenFrameBoard filled={boardA} onChange={setBoardA} color="#14b8a6" secondaryColor="#2dd4bf" size={42} showValue={false} quickAdd={false} />
        </div>
      );
    }

    if (activityType === "addition") {
      return (
        <div className="addition-equation">
          <div className="addition-prompt" style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.helper}</div>
          <div className="addition-label" style={{ color: "#4f46e5", background: "rgba(99,102,241,0.1)" }}>Build {challenge.left}</div>
          <TenFrameBoard filled={boardB} onChange={setBoardB} color="#6366f1" secondaryColor="#818cf8" size={38} showValue={false} quickAdd={false} />
          <div className="addition-operator">+</div>
          <div className="addition-label" style={{ color: "#ea580c", background: "rgba(249,115,22,0.1)" }}>Build {challenge.right}</div>
          <TenFrameBoard filled={boardC} onChange={setBoardC} color="#f97316" secondaryColor="#fb923c" size={38} showValue={false} quickAdd={false} />
          <div className="addition-operator">=</div>
          <div className="addition-label" style={{ color: "#059669", background: "rgba(16,185,129,0.1)" }}>Build total</div>
          <TenFrameBoard filled={boardA} onChange={setBoardA} color="#10b981" secondaryColor="#34d399" size={38} showValue={false} quickAdd={false} />
        </div>
      );
    }

    if (activityType === "make10") {
      return (
        <div className="addition-equation">
          <div className="addition-prompt" style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.prompt}</div>
          <div className="addition-label" style={{ color: "#0f766e", background: "rgba(20,184,166,0.1)" }}>Build {challenge.start}</div>
          <TenFrameBoard filled={buildFilled(challenge.start)} color="#14b8a6" secondaryColor="#2dd4bf" disabled size={42} showValue={false} quickAdd={false} />
          <div className="addition-operator">+</div>
          <div className="addition-label" style={{ color: "#b45309", background: "rgba(245,158,11,0.12)" }}>Build missing part</div>
          <TenFrameBoard filled={boardA.length > challenge.start ? boardA.slice(challenge.start) : []} onChange={value => setBoardA(buildFilled(challenge.start).concat(value || []))} color="#f59e0b" secondaryColor="#fbbf24" size={42} showValue={false} quickAdd={false} />
          <div className="addition-note" style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Add counters until the whole frame has 10.</div>
        </div>
      );
    }

    if (activityType === "numberbond") {
      return (
        <div className="addition-equation">
          <div className="addition-prompt" style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.prompt}</div>
          <div className="addition-label" style={{ color: "#db2777", background: "rgba(236,72,153,0.1)" }}>Whole</div>
          <TenFrameBoard filled={buildFilled(challenge.whole)} color="#ec4899" secondaryColor="#f472b6" disabled size={38} showValue={false} quickAdd={false} />
          <div className="addition-operator">=</div>
          <div className="addition-label" style={{ color: "#0891b2", background: "rgba(6,182,212,0.1)" }}>Missing part</div>
          <TenFrameBoard filled={boardA} onChange={setBoardA} color="#06b6d4" secondaryColor="#22d3ee" size={38} showValue={false} quickAdd={false} />
        </div>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>{challenge.prompt}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setSelectedAnswer("left")}
            style={{
              border: `3px solid ${selectedAnswer === "left" ? "#14b8a6" : "#e2e8f0"}`,
              background: selectedAnswer === "left" ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.8)",
              borderRadius: 18,
              padding: "14px 18px",
              minWidth: 104,
              cursor: "pointer",
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#334155",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <TenFrameBoard filled={buildFilled(challenge.left)} color="#6366f1" secondaryColor="#818cf8" disabled size={28} showValue={false} quickAdd={false} />
              <span>Left</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedAnswer("equal")}
            style={{
              order: 2,
              border: `3px solid ${selectedAnswer === "equal" ? "#f59e0b" : "#e2e8f0"}`,
              background: selectedAnswer === "equal" ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.8)",
              borderRadius: 18,
              padding: "14px 18px",
              minWidth: 104,
              cursor: "pointer",
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#334155",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 24 }}> = </div>
              <span>Equal</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSelectedAnswer("right")}
            style={{
              order: 1,
              border: `3px solid ${selectedAnswer === "right" ? "#f97316" : "#e2e8f0"}`,
              background: selectedAnswer === "right" ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.8)",
              borderRadius: 18,
              padding: "14px 18px",
              minWidth: 104,
              cursor: "pointer",
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#334155",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <TenFrameBoard filled={buildFilled(challenge.right)} color="#f97316" secondaryColor="#fb923c" disabled size={28} showValue={false} quickAdd={false} />
              <span>Right</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #ecfeff 0%, #fdf2d4 100%)", fontFamily: "'Fredoka', sans-serif", display: "flex", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={() => { SoundEngine.navigate(); onLevelSelect(); }} style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 12, padding: "8px 14px", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "#64748b", cursor: "pointer" }}>
            ← Levels
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🧮</span>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>Number Frame</span>
          </div>
          <button onClick={() => { SoundEngine.navigate(); onHome(); }} style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 12, padding: "8px 14px", fontFamily: "'Fredoka', sans-serif", fontWeight: 600, color: "#64748b", cursor: "pointer" }}>
            Home
          </button>
        </div>

        <div style={{ background: "rgba(255,255,255,0.78)", borderRadius: 28, padding: 18, boxShadow: "0 10px 30px rgba(20,184,166,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Activity</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a" }}>{level.name}</div>
            </div>
            <div style={{ background: "rgba(20,184,166,0.08)", borderRadius: 14, padding: "8px 10px", fontWeight: 700, color: "#0f766e" }}>
              {score} points
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {activityTypes.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => switchActivity(item.id)}
                style={{
                  border: activityType === item.id ? "2px solid #14b8a6" : "2px solid #e2e8f0",
                  background: activityType === item.id ? "rgba(20,184,166,0.08)" : "rgba(255,255,255,0.8)",
                  borderRadius: 12,
                  padding: "9px 10px",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  color: activityType === item.id ? "#0f766e" : "#475569",
                  cursor: "pointer",
                }}
              >
                {item.emoji} {item.label}
              </button>
            ))}
          </div>

          <div style={{ background: "rgba(255,255,255,0.74)", borderRadius: 22, padding: "18px 14px", border: "2px solid rgba(20,184,166,0.16)" }}>
            {renderBoardPreview()}
          </div>

          {feedback && (
            <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 14, fontWeight: 700, textAlign: "center", background: feedback === "correct" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: feedback === "correct" ? "#166534" : "#b91c1c" }}>
              {feedback === "correct" ? "Great job! You got it!" : `Almost! ${challenge.helper}`}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={clearActivity}
              disabled={!hasClearableInput}
              style={{
                border: "none",
                borderRadius: 14,
                background: "rgba(148,163,184,0.12)",
                color: "#475569",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700,
                padding: "12px 22px",
                cursor: hasClearableInput ? "pointer" : "not-allowed",
                opacity: hasClearableInput ? 1 : 0.5,
              }}
            >
              Clear
            </button>

            {activityType !== "compare" && (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #14b8a6, #2dd4bf)",
                  color: "white",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  padding: "12px 22px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(20,184,166,0.18)",
                }}
              >
                Check
              </button>
            )}

            {activityType === "compare" && (
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #f59e0b, #f97316)",
                  color: "white",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  padding: "12px 22px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(249,115,22,0.18)",
                }}
              >
                Choose
              </button>
            )}

            {feedback && (
              <button
                type="button"
                onClick={nextChallenge}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 700,
                  padding: "12px 22px",
                  cursor: "pointer",
                }}
              >
                Next challenge
              </button>
            )}
          </div>

          <div style={{ marginTop: 16, textAlign: "center", fontWeight: 700, color: "#64748b" }}>
            Round {round}
          </div>
        </div>
      </div>
      <style>{`
        .addition-equation { display:grid; grid-template-columns:100px auto; justify-content:center; align-items:center; column-gap:10px; row-gap:8px; }
        .addition-prompt { grid-column:1 / -1; justify-self:center; margin-bottom:4px; }
        .addition-label { justify-self:end; padding:7px 10px; border-radius:9px; font-size:12px; font-weight:700; white-space:nowrap; }
        .addition-operator { grid-column:2; justify-self:center; text-align:center; font-size:28px; line-height:1; font-weight:700; color:#94a3b8; }
        .addition-note { grid-column:1 / -1; justify-self:center; margin-top:4px; }
        @media (max-width:520px) {
          .addition-equation { grid-template-columns:minmax(0, 1fr); row-gap:6px; }
          .addition-prompt, .addition-operator { grid-column:1; }
          .addition-note { grid-column:1; }
          .addition-label { justify-self:center; }
          .addition-equation > :not(.addition-prompt):not(.addition-label):not(.addition-operator) { justify-self:center; }
        }
      `}</style>
    </div>
  );
}
