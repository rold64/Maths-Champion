import SoundEngine from "../sounds/SoundEngine.js";

export default function NumberPad({ onPress, disabled }) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const base = {
    width: 56, height: 56, borderRadius: 14, border: "none",
    fontSize: 24, fontWeight: 700, fontFamily: "'Fredoka', sans-serif",
    cursor: "pointer", transition: "all 0.1s",
  };

  function press(key) {
    if (disabled) return;
    if (key === "backspace") SoundEngine.backspace();
    else SoundEngine.tap();
    onPress(key);
  }

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8, maxWidth:340, margin:"0 auto" }}>
      {nums.map((n) => (
        <button key={n} onClick={() => press(String(n))} disabled={disabled}
          style={{
            ...base,
            background: "linear-gradient(145deg, #ffffff, #e6e9ef)",
            boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
            color: "#334155", opacity: disabled ? 0.5 : 1,
          }}
          onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.93)"; }}
          onMouseUp={(e)   => { e.currentTarget.style.transform = "scale(1)"; }}
          onMouseLeave={(e)=> { e.currentTarget.style.transform = "scale(1)"; }}
        >{n}</button>
      ))}
      <button onClick={() => press("backspace")} disabled={disabled} style={{
        ...base,
        background: "linear-gradient(145deg, #fde68a, #f59e0b)",
        boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
        color: "#78350f", fontSize: 18, opacity: disabled ? 0.5 : 1,
      }}>←</button>
      <button onClick={() => press("submit")} disabled={disabled} style={{
        ...base,
        background: "linear-gradient(145deg, #86efac, #22c55e)",
        boxShadow: "3px 3px 8px #d1d5db, -3px -3px 8px #ffffff",
        color: "#14532d", fontSize: 18, opacity: disabled ? 0.5 : 1,
      }}>✓</button>
    </div>
  );
}
