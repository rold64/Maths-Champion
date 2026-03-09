import { useState, useEffect, useRef } from "react";

/* ─────────── Sound Engine (Web Audio API) ─────────── */

const SoundEngine = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function playTone(freq, duration, type = "sine", volume = 0.15, delay = 0) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration);
    } catch (e) {}
  }

  return {
    tap() { playTone(880, 0.06, "sine", 0.08); },
    correct() {
      playTone(523, 0.12, "sine", 0.18, 0);
      playTone(659, 0.12, "sine", 0.18, 0.1);
      playTone(784, 0.2, "sine", 0.2, 0.2);
    },
    wrong() {
      playTone(250, 0.25, "triangle", 0.12, 0);
      playTone(200, 0.35, "triangle", 0.1, 0.15);
    },
    streak() {
      playTone(660, 0.1, "sine", 0.15, 0);
      playTone(880, 0.1, "sine", 0.15, 0.08);
      playTone(1100, 0.1, "sine", 0.15, 0.16);
      playTone(1320, 0.25, "sine", 0.18, 0.24);
    },
    victory() {
      playTone(523, 0.15, "sine", 0.18, 0);
      playTone(659, 0.15, "sine", 0.18, 0.12);
      playTone(784, 0.15, "sine", 0.18, 0.24);
      playTone(1047, 0.35, "sine", 0.22, 0.36);
      playTone(784, 0.1, "triangle", 0.08, 0.36);
      playTone(1047, 0.1, "triangle", 0.08, 0.46);
    },
    backspace() { playTone(440, 0.05, "square", 0.04); },
    selectChallenge() {
      playTone(520, 0.1, "sine", 0.12, 0);
      playTone(780, 0.15, "sine", 0.14, 0.08);
    },
    selectLevel() {
      playTone(600, 0.08, "sine", 0.1, 0);
      playTone(800, 0.08, "sine", 0.12, 0.07);
      playTone(1000, 0.14, "sine", 0.14, 0.14);
    },
    navigate() {
      playTone(600, 0.08, "sine", 0.08, 0);
      playTone(450, 0.12, "sine", 0.06, 0.06);
    },
  };
})();

/* ─────────── Shared Constants & Utilities ─────────── */

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap";

const OPERATIONS = [
  {
    id: "addition", name: "Addition", symbol: "+", emoji: "➕",
    color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
    bg: "linear-gradient(135deg, #fef9c3 0%, #fce7f3 35%, #dbeafe 65%, #d1fae5 100%)",
    tagline: "Put numbers together!", dotColorA: "#6366f1", dotColorB: "#ec4899",
  },
  {
    id: "subtraction", name: "Subtraction", symbol: "−", emoji: "➖",
    color: "#0ea5e9", gradient: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
    bg: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 35%, #ecfeff 65%, #cffafe 100%)",
    tagline: "Take numbers away!", dotColorA: "#0ea5e9", dotColorB: "#f43f5e",
  },
  {
    id: "multiplication", name: "Multiplication", symbol: "×", emoji: "✖️",
    color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 35%, #fef9c3 65%, #fefce8 100%)",
    tagline: "Groups of numbers!", dotColorA: "#f59e0b", dotColorB: "#8b5cf6",
  },
  {
    id: "division", name: "Division", symbol: "÷", emoji: "➗",
    color: "#10b981", gradient: "linear-gradient(135deg, #10b981, #34d399)",
    bg: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 35%, #f0fdf4 65%, #dcfce7 100%)",
    tagline: "Share numbers equally!", dotColorA: "#10b981", dotColorB: "#f97316",
  },
  {
    id: "addsub", name: "Add ↔ Sub", symbol: "↔", emoji: "🔄",
    color: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    bg: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 35%, #eef2ff 65%, #e0e7ff 100%)",
    tagline: "Fact families: + and −!", dotColorA: "#6366f1", dotColorB: "#0ea5e9",
    isFamily: true,
  },
  {
    id: "muldiv", name: "Mul ↔ Div", symbol: "↔", emoji: "🔁",
    color: "#d97706", gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 35%, #ecfdf5 65%, #d1fae5 100%)",
    tagline: "Fact families: × and ÷!", dotColorA: "#f59e0b", dotColorB: "#10b981",
    isFamily: true,
  },
];

const LEVELS = {
  addition: [
    { name: "Starter", label: "1–5", max: 5, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "1–10", max: 10, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "1–20", max: 20, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "1–50", max: 50, emoji: "⭐", color: "#E91E63" },
  ],
  subtraction: [
    { name: "Starter", label: "1–5", max: 5, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "1–10", max: 10, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "1–20", max: 20, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "1–50", max: 50, emoji: "⭐", color: "#E91E63" },
  ],
  multiplication: [
    { name: "Starter", label: "×1–3", max: 3, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "×1–5", max: 5, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "×1–10", max: 10, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "×1–12", max: 12, emoji: "⭐", color: "#E91E63" },
  ],
  division: [
    { name: "Starter", label: "÷1–3", max: 3, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "÷1–5", max: 5, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "÷1–10", max: 10, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "÷1–12", max: 12, emoji: "⭐", color: "#E91E63" },
  ],
  addsub: [
    { name: "Starter", label: "1–5", max: 5, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "1–10", max: 10, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "1–15", max: 15, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "1–20", max: 20, emoji: "⭐", color: "#E91E63" },
  ],
  muldiv: [
    { name: "Starter", label: "1–3", max: 3, emoji: "🌱", color: "#4CAF50" },
    { name: "Explorer", label: "1–5", max: 5, emoji: "🚀", color: "#2196F3" },
    { name: "Champion", label: "1–10", max: 10, emoji: "🏆", color: "#FF9800" },
    { name: "Legend", label: "1–12", max: 12, emoji: "⭐", color: "#E91E63" },
  ],
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(opId, max) {
  let a, b, answer;
  switch (opId) {
    case "addition":
      a = randomInt(1, max);
      b = randomInt(1, Math.max(1, max - a));
      answer = a + b;
      return { a, b, answer };
    case "subtraction":
      a = randomInt(2, max);
      b = randomInt(1, a - 1 > 0 ? a - 1 : 1);
      answer = a - b;
      return { a, b, answer };
    case "multiplication":
      a = randomInt(1, max);
      b = randomInt(1, max);
      answer = a * b;
      return { a, b, answer };
    case "division":
      b = randomInt(1, max);
      answer = randomInt(1, max);
      a = b * answer;
      return { a, b, answer };
    case "addsub": {
      const x = randomInt(1, max);
      const y = randomInt(1, Math.max(1, max - x));
      const total = x + y;
      const family = { x, y, total };
      const forms = [
        { a: x, b: y, answer: total, symbol: "+", familyType: "a+b" },
        { a: y, b: x, answer: total, symbol: "+", familyType: "b+a" },
        { a: total, b: x, answer: y, symbol: "−", familyType: "t-a" },
        { a: total, b: y, answer: x, symbol: "−", familyType: "t-b" },
      ];
      const pick = forms[randomInt(0, 3)];
      return { ...pick, family };
    }
    case "muldiv": {
      const x = randomInt(1, max);
      const y = randomInt(1, max);
      const total = x * y;
      const family = { x, y, total };
      const forms = [
        { a: x, b: y, answer: total, symbol: "×", familyType: "a*b" },
        { a: y, b: x, answer: total, symbol: "×", familyType: "b*a" },
        { a: total, b: x, answer: y, symbol: "÷", familyType: "t/a" },
        { a: total, b: y, answer: x, symbol: "÷", familyType: "t/b" },
      ];
      const pick = forms[randomInt(0, 3)];
      return { ...pick, family };
    }
    default:
      return { a: 1, b: 1, answer: 2 };
  }
}

function getSymbol(opId, problem) {
  if (problem.symbol) return problem.symbol;
  const op = OPERATIONS.find((o) => o.id === opId);
  return op ? op.symbol : "+";
}

/* ─────────── Shared Components ─────────── */

function StarBurst({ x, y }) {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE"];
  return (
    <div style={{ position: "fixed", left: x - 30, top: y - 30, pointerEvents: "none", zIndex: 9999 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", width: 10, height: 10, borderRadius: "50%",
          background: colors[i % colors.length],
          animation: `burst-${i} 0.6s ease-out forwards`,
        }} />
      ))}
      <style>{`${Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * 60;
        const dy = Math.sin(rad) * 60;
        return `@keyframes burst-${i} {
          0% { transform: translate(30px,30px) scale(1); opacity:1; }
          100% { transform: translate(${30+dx}px,${30+dy}px) scale(0); opacity:0; }
        }`;
      }).join("\n")}`}</style>
    </div>
  );
}

function DotGroup({ count, color, label }) {
  const rows = [];
  let remaining = count;
  while (remaining > 0) { const inRow = Math.min(remaining, 5); rows.push(inRow); remaining -= inRow; }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 26, fontWeight: 600, color, marginBottom: 2 }}>{label}</div>
      <div style={{
        background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "10px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        minWidth: 70, boxShadow: `0 2px 10px ${color}33`, border: `2px solid ${color}44`,
      }}>
        {rows.map((n, ri) => (
          <div key={ri} style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: n }).map((_, ci) => (
              <div key={ci} style={{
                width: 16, height: 16, borderRadius: "50%", background: color,
                boxShadow: `0 2px 4px ${color}66`,
                animation: `popIn 0.3s ease-out ${(ri * 5 + ci) * 0.04}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiplicationDots({ a, b, color }) {
  if (a * b > 60) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 12 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 500, color: "#94a3b8", marginBottom: 2 }}>
        {a} groups of {b}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "10px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        boxShadow: `0 2px 10px ${color}22`,
      }}>
        {Array.from({ length: a }).map((_, ri) => (
          <div key={ri} style={{ display: "flex", gap: 5, padding: "3px 6px", borderRadius: 8, background: `${color}11` }}>
            {Array.from({ length: b }).map((_, ci) => (
              <div key={ci} style={{
                width: 14, height: 14, borderRadius: "50%", background: color,
                animation: `popIn 0.25s ease-out ${(ri * b + ci) * 0.03}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function DivisionDots({ total, divisor, color }) {
  const groups = total / divisor;
  if (total > 60) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 12 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 500, color: "#94a3b8", marginBottom: 2 }}>
        {total} shared into groups of {divisor}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "10px 14px",
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8,
        boxShadow: `0 2px 10px ${color}22`,
      }}>
        {Array.from({ length: groups }).map((_, gi) => (
          <div key={gi} style={{
            display: "flex", gap: 4, padding: "4px 8px", borderRadius: 10,
            border: `2px dashed ${color}55`, background: `${color}08`,
          }}>
            {Array.from({ length: divisor }).map((_, di) => (
              <div key={di} style={{
                width: 14, height: 14, borderRadius: "50%", background: color,
                animation: `popIn 0.25s ease-out ${(gi * divisor + di) * 0.03}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Fact Family Triangle Visual ─────────── */

function FactFamilyTriangle({ family, opType, colorA, colorB }) {
  const { x, y, total } = family;
  const isAddSub = opType === "addsub";
  const opSymbols = isAddSub ? ["+", "−"] : ["×", "÷"];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 500, color: "#94a3b8", marginBottom: 6 }}>
        Fact Family
      </div>
      <svg width="180" height="140" viewBox="0 0 180 140" style={{ overflow: "visible" }}>
        <polygon points="90,12 20,125 160,125" fill={`${colorA}08`} stroke={colorA} strokeWidth="3" strokeLinejoin="round" opacity="0.35" />

        <circle cx="90" cy="14" r="24" fill="white" stroke={colorA} strokeWidth="2.5" />
        <text x="90" y="20" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="20" fontWeight="700" fill={colorA}>
          {total}
        </text>

        <circle cx="24" cy="122" r="22" fill="white" stroke={colorB} strokeWidth="2.5" />
        <text x="24" y="128" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill={colorB}>
          {x}
        </text>

        <circle cx="156" cy="122" r="22" fill="white" stroke={colorB} strokeWidth="2.5" />
        <text x="156" y="128" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill={colorB}>
          {y}
        </text>

        <text x="48" y="66" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="600" fill="#94a3b8">
          {opSymbols[0]}
        </text>
        <text x="132" y="66" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="600" fill="#94a3b8">
          {opSymbols[1]}
        </text>
      </svg>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 6 }}>
        {isAddSub ? (
          <>
            <MiniEq text={`${x}+${y}=${total}`} c={colorA} />
            <MiniEq text={`${y}+${x}=${total}`} c={colorA} />
            <MiniEq text={`${total}−${x}=${y}`} c={colorB} />
            <MiniEq text={`${total}−${y}=${x}`} c={colorB} />
          </>
        ) : (
          <>
            <MiniEq text={`${x}×${y}=${total}`} c={colorA} />
            <MiniEq text={`${y}×${x}=${total}`} c={colorA} />
            <MiniEq text={`${total}÷${x}=${y}`} c={colorB} />
            <MiniEq text={`${total}÷${y}=${x}`} c={colorB} />
          </>
        )}
      </div>
    </div>
  );
}

function MiniEq({ text, c }) {
  return (
    <div style={{
      background: `${c}12`, borderRadius: 8, padding: "3px 10px",
      fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600,
      color: c, border: `1.5px solid ${c}25`,
    }}>{text}</div>
  );
}

/* ─────────── Number Pad & Progress ─────────── */

function NumberPad({ onPress, disabled }) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, maxWidth: 340, margin: "0 auto" }}>
      {nums.map((n) => (
        <button key={n} onClick={() => onPress(String(n))} disabled={disabled}
          style={{
            width: 56, height: 56, borderRadius: 14, border: "none",
            background: "linear-gradient(145deg, #ffffff, #e6e9ef)",
            boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
            fontSize: 24, fontWeight: 700, fontFamily: "'Fredoka', sans-serif",
            color: "#334155", cursor: disabled ? "not-allowed" : "pointer",
            transition: "all 0.1s", opacity: disabled ? 0.5 : 1,
          }}
          onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.93)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >{n}</button>
      ))}
      <button onClick={() => onPress("backspace")} disabled={disabled} style={{
        width: 56, height: 56, borderRadius: 14, border: "none",
        background: "linear-gradient(145deg, #fde68a, #f59e0b)",
        boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
        fontSize: 18, fontWeight: 700, fontFamily: "'Fredoka', sans-serif",
        color: "#78350f", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      }}>←</button>
      <button onClick={() => onPress("submit")} disabled={disabled} style={{
        width: 56, height: 56, borderRadius: 14, border: "none",
        background: "linear-gradient(145deg, #86efac, #22c55e)",
        boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
        fontSize: 18, fontWeight: 700, fontFamily: "'Fredoka', sans-serif",
        color: "#14532d", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      }}>✓</button>
    </div>
  );
}

function ProgressBar({ current, total, color }) {
  return (
    <div style={{ width: "100%", height: 14, borderRadius: 7, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${(current / total) * 100}%`, borderRadius: 7,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 0.5s ease",
      }} />
    </div>
  );
}

/* ─────────── Visual Helper ─────────── */

function VisualHelper({ opId, problem, op }) {
  const { a, b } = problem;

  if (opId === "addsub" && problem.family) {
    return <FactFamilyTriangle family={problem.family} opType="addsub" colorA={op.dotColorA} colorB={op.dotColorB} />;
  }
  if (opId === "muldiv" && problem.family) {
    return <FactFamilyTriangle family={problem.family} opType="muldiv" colorA={op.dotColorA} colorB={op.dotColorB} />;
  }

  switch (opId) {
    case "addition":
      if (a + b > 30) return null;
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
          <DotGroup count={a} color={op.dotColorA} label={a} />
          <span style={{ fontSize: 30, fontWeight: 700, color: "#94a3b8", alignSelf: "center" }}>+</span>
          <DotGroup count={b} color={op.dotColorB} label={b} />
        </div>
      );
    case "subtraction":
      if (a > 30) return null;
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 500, color: "#94a3b8" }}>
            Start with {a}, take away {b}
          </div>
          <div style={{
            background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "10px 14px",
            display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", maxWidth: 200,
            boxShadow: `0 2px 10px ${op.dotColorA}22`,
          }}>
            {Array.from({ length: a }).map((_, i) => (
              <div key={i} style={{
                width: 16, height: 16, borderRadius: "50%",
                background: i < a - b ? op.dotColorA : op.dotColorB,
                opacity: i < a - b ? 1 : 0.35,
                animation: `popIn 0.25s ease-out ${i * 0.03}s both`,
              }} />
            ))}
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 12, color: "#94a3b8" }}>
            <span style={{ color: op.dotColorA }}>● keep</span> &nbsp; <span style={{ color: op.dotColorB, opacity: 0.5 }}>● remove</span>
          </div>
        </div>
      );
    case "multiplication":
      return <MultiplicationDots a={a} b={b} color={op.dotColorA} />;
    case "division":
      return <DivisionDots total={a} divisor={b} color={op.dotColorA} />;
    default:
      return null;
  }
}

/* ─────────── Homepage ─────────── */

function Homepage({ onSelect }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fef9c3 0%, #fce7f3 25%, #dbeafe 50%, #d1fae5 75%, #fef3c7 100%)",
      fontFamily: "'Fredoka', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "30px 16px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "fixed", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "rgba(251,191,36,0.12)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(96,165,250,0.1)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "50%", right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(52,211,153,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "20%", left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(236,72,153,0.08)", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", maxWidth: 460, width: "100%", animation: "fadeUp 0.5s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 8, animation: "bounce 2s ease-in-out infinite" }}>🧮</div>
        <h1 style={{
          fontSize: 40, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.1,
          background: "linear-gradient(135deg, #f59e0b, #ec4899, #6366f1, #10b981)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Maths Champion
        </h1>
        <p style={{ color: "#64748b", fontSize: 18, margin: "0 0 28px", fontWeight: 500 }}>
          Choose your challenge and become a superstar!
        </p>

        {/* Core 4 operations */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {OPERATIONS.filter(o => !o.isFamily).map((op, i) => (
            <OpCard key={op.id} op={op} delay={i * 0.08} onSelect={onSelect} />
          ))}
        </div>

        {/* Fact Family section */}
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600,
          color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.5,
          marginBottom: 10,
        }}>
          🌟 Fact Family Challenges
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {OPERATIONS.filter(o => o.isFamily).map((op, i) => (
            <OpCard key={op.id} op={op} delay={(i + 4) * 0.08} onSelect={onSelect} isFamily />
          ))}
        </div>

        <div style={{
          padding: "14px 20px", borderRadius: 16,
          background: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)",
          border: "2px dashed #e2e8f0",
        }}>
          <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>
            💡 <strong style={{ color: "#64748b" }}>Tip for parents:</strong> Start with Starter level and enable visuals. Try Fact Family challenges to deepen understanding!
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      `}</style>
    </div>
  );
}

function OpCard({ op, delay, onSelect, isFamily }) {
  return (
    <button onClick={() => { SoundEngine.selectChallenge(); onSelect(op.id); }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "24px 14px", borderRadius: 24,
        border: `3px solid ${op.color}22`,
        background: isFamily ? `linear-gradient(145deg, rgba(255,255,255,0.85), ${op.color}08)` : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(8px)", cursor: "pointer", transition: "all 0.25s",
        boxShadow: `0 6px 24px ${op.color}15`,
        animation: `fadeUp 0.5s ease ${delay}s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
        e.currentTarget.style.borderColor = op.color;
        e.currentTarget.style.boxShadow = `0 12px 32px ${op.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = `${op.color}22`;
        e.currentTarget.style.boxShadow = `0 6px 24px ${op.color}15`;
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: isFamily
          ? `linear-gradient(135deg, ${op.dotColorA}20, ${op.dotColorB}20)`
          : `${op.color}15`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
        border: `2px solid ${op.color}22`,
      }}>{op.emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b" }}>{op.name}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{op.tagline}</div>
    </button>
  );
}

/* ─────────── Level Select ─────────── */

function LevelSelect({ opId, onSelectLevel, onBack }) {
  const op = OPERATIONS.find((o) => o.id === opId);
  const levels = LEVELS[opId];
  return (
    <div style={{
      minHeight: "100vh", background: op.bg, fontFamily: "'Fredoka', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 16px", position: "relative",
    }}>
      <div style={{ textAlign: "center", maxWidth: 420, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <button onClick={() => { SoundEngine.navigate(); onBack(); }} style={{
          background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 12,
          padding: "8px 16px", fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
          color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16,
        }}>← Home</button>

        <div style={{ fontSize: 48, marginBottom: 8 }}>{op.emoji}</div>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: op.color, margin: "0 0 4px" }}>{op.name}</h2>
        <p style={{ color: "#64748b", fontSize: 16, margin: "0 0 8px", fontWeight: 500 }}>{op.tagline}</p>

        {op.isFamily && (
          <div style={{
            background: "rgba(255,255,255,0.6)", borderRadius: 14, padding: "10px 16px",
            marginBottom: 16, border: `2px solid ${op.color}20`,
          }}>
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500, lineHeight: 1.5 }}>
              {opId === "addsub"
                ? "🧩 Every addition has a matching subtraction! If 3+5=8, then 8−5=3 and 8−3=5. Discover these number families!"
                : "🧩 Every multiplication has a matching division! If 3×4=12, then 12÷4=3 and 12÷3=4. Discover these number families!"}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {levels.map((l, i) => (
            <button key={i} onClick={() => { SoundEngine.selectLevel(); onSelectLevel(i); }}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "16px 24px",
                borderRadius: 20, border: `3px solid ${l.color}33`,
                background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)",
                cursor: "pointer", transition: "all 0.2s", boxShadow: `0 4px 16px ${l.color}22`,
                animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.borderColor = l.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.borderColor = `${l.color}33`;
              }}
            >
              <span style={{ fontSize: 36 }}>{l.emoji}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{l.name}</div>
                <div style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>{l.label}</div>
              </div>
              <div style={{
                marginLeft: "auto", width: 40, height: 40, borderRadius: 12,
                background: `${l.color}18`, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 20, color: l.color, fontWeight: 700,
              }}>→</div>
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

/* ─────────── Game Screen ─────────── */

function GameScreen({ opId, levelIdx, onHome, onLevelSelect }) {
  const op = OPERATIONS.find((o) => o.id === opId);
  const lvl = LEVELS[opId][levelIdx];
  const totalRounds = 10;

  const [problem, setProblem] = useState(() => generateProblem(opId, lvl.max));
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [showDots, setShowDots] = useState(true);
  const [done, setDone] = useState(false);
  const burstId = useRef(0);
  const feedbackMsgRef = useRef("");

  const sym = getSymbol(opId, problem);

  const encouragements = ["Amazing! 🎉", "You're a star! ⭐", "Fantastic! 🌟", "Super brain! 🧠", "Wow! 🎊", "Nailed it! 💪"];

  function getHelpMessage() {
    if (opId === "addsub" && problem.family) {
      const { x, y, total } = problem.family;
      const msgs = [
        `The answer is ${problem.answer}. Because ${x}+${y}=${total}, we know ${total}−${y}=${x}!`,
        `${problem.a} ${sym} ${problem.b} = ${problem.answer}. Family: ${x}, ${y}, ${total}!`,
        `Almost! Answer was ${problem.answer}. Remember: ${x}+${y}=${total} ↔ ${total}−${x}=${y}`,
      ];
      return msgs[randomInt(0, msgs.length - 1)];
    }
    if (opId === "muldiv" && problem.family) {
      const { x, y, total } = problem.family;
      const msgs = [
        `The answer is ${problem.answer}. Because ${x}×${y}=${total}, we know ${total}÷${y}=${x}!`,
        `${problem.a} ${sym} ${problem.b} = ${problem.answer}. Family: ${x}, ${y}, ${total}!`,
        `Almost! Answer was ${problem.answer}. Remember: ${x}×${y}=${total} ↔ ${total}÷${x}=${y}`,
      ];
      return msgs[randomInt(0, msgs.length - 1)];
    }
    const msgs = [
      `The answer is ${problem.answer}. You'll get the next one!`,
      `Almost! ${problem.a} ${sym} ${problem.b} = ${problem.answer}`,
      `Keep going! The answer was ${problem.answer}`,
    ];
    return msgs[randomInt(0, msgs.length - 1)];
  }

  function getCorrectMessage() {
    if (opId === "addsub" && problem.family) {
      const { x, y, total } = problem.family;
      const bonus = [
        ...encouragements,
        `Yes! ${x}+${y}=${total} and ${total}−${x}=${y}! 🔗`,
        `You see the pattern! ${x}, ${y}, ${total} are a family! 👨‍👩‍👧`,
      ];
      return bonus[randomInt(0, bonus.length - 1)];
    }
    if (opId === "muldiv" && problem.family) {
      const { x, y, total } = problem.family;
      const bonus = [
        ...encouragements,
        `Yes! ${x}×${y}=${total} and ${total}÷${x}=${y}! 🔗`,
        `You see the pattern! ${x}, ${y}, ${total} are a family! 👨‍👩‍👧`,
      ];
      return bonus[randomInt(0, bonus.length - 1)];
    }
    return encouragements[randomInt(0, encouragements.length - 1)];
  }

  function addBurst() {
    const id = burstId.current++;
    const el = document.querySelector("[data-answer-box]");
    const rect = el?.getBoundingClientRect?.();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top : window.innerHeight / 2;
    setBursts((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 700);
  }

  function handleNumberPad(key) {
    if (feedback) return;
    if (key === "backspace") { SoundEngine.backspace(); setUserInput((prev) => prev.slice(0, -1)); }
    else if (key === "submit") { SoundEngine.tap(); checkAnswer(); }
    else if (userInput.length < 4) { SoundEngine.tap(); setUserInput((prev) => prev + key); }
  }

  function checkAnswer() {
    if (!userInput || feedback) return;
    const correct = parseInt(userInput) === problem.answer;
    if (correct) {
      addBurst();
      setScore((s) => s + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        if (next >= 3 && next % 3 === 0) SoundEngine.streak(); else SoundEngine.correct();
        return next;
      });
      feedbackMsgRef.current = getCorrectMessage();
    } else {
      SoundEngine.wrong();
      setStreak(0);
      feedbackMsgRef.current = getHelpMessage();
    }
    setResults((prev) => [...prev, {
      a: problem.a, b: problem.b, answer: problem.answer,
      userAnswer: parseInt(userInput), correct, symbol: sym,
    }]);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (round + 1 >= totalRounds) setDone(true);
      else {
        setRound((r) => r + 1);
        setProblem(generateProblem(opId, lvl.max));
        setUserInput("");
        setFeedback(null);
      }
    }, correct ? 1200 : 2800);
  }

  useEffect(() => { if (done) SoundEngine.victory(); }, [done]);

  if (done) {
    return (
      <div style={{
        minHeight: "100vh", background: op.bg, fontFamily: "'Fredoka', sans-serif",
        display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 420, width: "100%", animation: "fadeUp 0.5s ease" }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>
            {score >= 9 ? "🏆" : score >= 7 ? "🌟" : score >= 5 ? "👍" : "💪"}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
            {score >= 9 ? "Incredible!" : score >= 7 ? "Great job!" : score >= 5 ? "Good work!" : "Keep practising!"}
          </h2>
          <p style={{ color: "#64748b", margin: "0 0 16px", fontWeight: 500, fontSize: 16 }}>
            You got <strong style={{ color: op.color }}>{score}</strong> out of <strong>{totalRounds}</strong> correct!
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 16 }}>
            {Array.from({ length: totalRounds }).map((_, i) => (
              <div key={i} style={{ fontSize: 22, opacity: i < score ? 1 : 0.2, animation: i < score ? `popIn 0.3s ease ${i * 0.06}s both` : "none" }}>⭐</div>
            ))}
          </div>
          {bestStreak > 1 && (
            <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: "8px 14px", display: "inline-block", marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: "#64748b" }}>Best streak: </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b" }}>🔥 {bestStreak}</span>
            </div>
          )}
          <div style={{
            background: "rgba(255,255,255,0.7)", borderRadius: 20, padding: 14,
            marginBottom: 18, maxHeight: 200, overflowY: "auto",
          }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "7px 12px", borderRadius: 10,
                background: r.correct ? "#f0fdf4" : "#fef2f2",
                marginBottom: i < results.length - 1 ? 5 : 0, fontSize: 15, fontWeight: 600,
              }}>
                <span style={{ color: "#334155" }}>{r.a} {r.symbol} {r.b} = {r.userAnswer}</span>
                <span>{r.correct ? <span style={{ color: "#16a34a" }}>✓</span> : <span style={{ color: "#dc2626" }}>✗ ({r.answer})</span>}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { SoundEngine.selectLevel(); setDone(false); setScore(0); setStreak(0); setRound(0); setResults([]); setFeedback(null); setUserInput(""); setProblem(generateProblem(opId, lvl.max)); }}
              style={{ padding: "13px 24px", borderRadius: 16, border: "none", background: op.gradient, color: "white", fontSize: 16, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", cursor: "pointer", boxShadow: `0 4px 16px ${op.color}44` }}>
              Play Again
            </button>
            <button onClick={() => { SoundEngine.navigate(); onLevelSelect(); }} style={{ padding: "13px 24px", borderRadius: 16, border: "2px solid #e2e8f0", background: "rgba(255,255,255,0.8)", color: "#64748b", fontSize: 16, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", cursor: "pointer" }}>
              Levels
            </button>
            <button onClick={() => { SoundEngine.navigate(); onHome(); }} style={{ padding: "13px 24px", borderRadius: 16, border: "2px solid #e2e8f0", background: "rgba(255,255,255,0.8)", color: "#64748b", fontSize: 16, fontWeight: 700, fontFamily: "'Fredoka', sans-serif", cursor: "pointer" }}>
              Home
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes popIn { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: op.bg, fontFamily: "'Fredoka', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "20px 16px", position: "relative", overflow: "hidden",
    }}>
      {bursts.map((b) => <StarBurst key={b.id} x={b.x} y={b.y} />)}

      <div style={{ textAlign: "center", maxWidth: 420, width: "100%", animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={() => { SoundEngine.navigate(); onLevelSelect(); }} style={{
            background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 12,
            padding: "8px 14px", fontFamily: "'Fredoka', sans-serif", fontWeight: 600,
            color: "#64748b", cursor: "pointer", fontSize: 14,
          }}>← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>{lvl.emoji}</span>
            <span style={{ fontWeight: 700, color: op.color, fontSize: 15 }}>{op.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {streak >= 3 && <span style={{ fontSize: 15 }}>🔥</span>}
            <span style={{ fontWeight: 600, color: "#f59e0b", fontSize: 15 }}>{score}/{round + 1}</span>
          </div>
        </div>

        <ProgressBar current={round + 1} total={totalRounds} color={op.color} />
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, marginBottom: 12, fontWeight: 500 }}>
          Question {round + 1} of {totalRounds}
        </div>

        <button onClick={() => setShowDots(!showDots)} style={{
          background: showDots ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
          border: "2px solid #e2e8f0", borderRadius: 10, padding: "5px 14px",
          fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 500,
          color: "#64748b", cursor: "pointer", marginBottom: 12, transition: "all 0.2s",
        }}>
          {showDots ? "Hide" : "Show"} {op.isFamily ? "fact family" : "counting dots"}
        </button>

        <div style={{
          background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)",
          borderRadius: 24, padding: "20px 18px", marginBottom: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          border: feedback === "correct" ? "3px solid #22c55e" : feedback === "wrong" ? "3px solid #ef4444" : "3px solid transparent",
          transition: "border-color 0.3s",
        }}>
          {showDots && <VisualHelper opId={opId} problem={problem} op={op} />}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 44, fontWeight: 700, color: op.dotColorA }}>{problem.a}</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#94a3b8" }}>{sym}</span>
            <span style={{ fontSize: 44, fontWeight: 700, color: op.dotColorB || op.color }}>{problem.b}</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: "#94a3b8" }}>=</span>
            <div data-answer-box style={{
              minWidth: 76, height: 60, borderRadius: 16,
              background: feedback === "correct" ? "#dcfce7" : feedback === "wrong" ? "#fee2e2" : "#f1f5f9",
              border: `3px dashed ${feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#cbd5e1"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 38, fontWeight: 700,
              color: feedback === "correct" ? "#16a34a" : feedback === "wrong" ? "#dc2626" : "#334155",
              transition: "all 0.3s",
            }}>
              {userInput || <span style={{ width: 3, height: 32, background: "#94a3b8", borderRadius: 2, animation: "blink 1s step-end infinite" }} />}
            </div>
          </div>

          {feedback && (
            <div style={{
              marginTop: 12, fontSize: feedback === "wrong" ? 15 : 17, fontWeight: 600,
              color: feedback === "correct" ? "#16a34a" : "#dc2626",
              animation: "fadeUp 0.3s ease", lineHeight: 1.4, padding: "0 4px",
            }}>
              {feedbackMsgRef.current}
            </div>
          )}
        </div>

        <NumberPad onPress={handleNumberPad} disabled={!!feedback} />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 50% { opacity:0; } }
        @keyframes popIn { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}

/* ─────────── Main App Router ─────────── */

export default function MathsChampion() {
  const [screen, setScreen] = useState("home");
  const [selectedOp, setSelectedOp] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <>
      <link href={FONT_LINK} rel="stylesheet" />
      {screen === "home" && (
        <Homepage onSelect={(opId) => { setSelectedOp(opId); setScreen("levels"); }} />
      )}
      {screen === "levels" && (
        <LevelSelect
          opId={selectedOp}
          onSelectLevel={(lvlIdx) => { setSelectedLevel(lvlIdx); setScreen("game"); }}
          onBack={() => setScreen("home")}
        />
      )}
      {screen === "game" && (
        <GameScreen
          key={`${selectedOp}-${selectedLevel}-${Date.now()}`}
          opId={selectedOp}
          levelIdx={selectedLevel}
          onHome={() => setScreen("home")}
          onLevelSelect={() => setScreen("levels")}
        />
      )}
    </>
  );
}
