export default function TenFrameBoard({
  filled = [],
  onChange,
  onToggle,
  color = "#6366f1",
  size = 54,
  disabled = false,
  showValue = true,
  label = null,
  quickAdd = true,
  secondaryColor = "#ec4899",
}) {
  const cells = Array.from({ length: 10 }, (_, index) => index);

  function addCount(delta) {
    if (disabled) return;
    const next = [...filled];
    for (let i = 0; i < delta; i += 1) {
      const nextIndex = cells.find(idx => !next.includes(idx));
      if (nextIndex !== undefined) next.push(nextIndex);
    }
    onChange?.(next.sort((a, b) => a - b));
  }

  function removeCount(delta) {
    if (disabled) return;
    const next = [...filled];
    for (let i = 0; i < delta; i += 1) {
      if (next.length === 0) break;
      next.pop();
    }
    onChange?.(next);
  }

  function handleCellClick(index) {
    if (disabled) return;
    if (onToggle) {
      onToggle(index);
      return;
    }
    const next = filled.includes(index)
      ? filled.filter(v => v !== index)
      : [...filled, index].sort((a, b) => a - b);
    onChange?.(next);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {quickAdd && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => addCount(1)}
            disabled={disabled || filled.length >= 10}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "6px 8px",
              background: "rgba(255,255,255,0.8)",
              color: "#334155",
              fontWeight: 700,
              fontSize: 11,
              cursor: disabled || filled.length >= 10 ? "not-allowed" : "pointer",
              opacity: disabled || filled.length >= 10 ? 0.5 : 1,
            }}
          >
            +1
          </button>
          <button
            type="button"
            onClick={() => addCount(5)}
            disabled={disabled || filled.length >= 10}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "6px 8px",
              background: "rgba(255,255,255,0.8)",
              color: "#334155",
              fontWeight: 700,
              fontSize: 11,
              cursor: disabled || filled.length >= 10 ? "not-allowed" : "pointer",
              opacity: disabled || filled.length >= 10 ? 0.5 : 1,
            }}
          >
            +5
          </button>
          <button
            type="button"
            onClick={() => addCount(10)}
            disabled={disabled || filled.length >= 10}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "6px 8px",
              background: "rgba(255,255,255,0.8)",
              color: "#334155",
              fontWeight: 700,
              fontSize: 11,
              cursor: disabled || filled.length >= 10 ? "not-allowed" : "pointer",
              opacity: disabled || filled.length >= 10 ? 0.5 : 1,
            }}
          >
            +10
          </button>
          <button
            type="button"
            onClick={() => removeCount(1)}
            disabled={disabled || filled.length === 0}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "6px 8px",
              background: "rgba(148,163,184,0.12)",
              color: "#334155",
              fontWeight: 700,
              fontSize: 11,
              cursor: disabled || filled.length === 0 ? "not-allowed" : "pointer",
              opacity: disabled || filled.length === 0 ? 0.5 : 1,
            }}
          >
            −1
          </button>
          <button
            type="button"
            onClick={() => onChange?.([])}
            disabled={disabled || filled.length === 0}
            style={{
              border: "none",
              borderRadius: 10,
              padding: "6px 8px",
              background: "rgba(148,163,184,0.12)",
              color: "#334155",
              fontWeight: 700,
              fontSize: 11,
              cursor: disabled || filled.length === 0 ? "not-allowed" : "pointer",
              opacity: disabled || filled.length === 0 ? 0.5 : 1,
            }}
          >
            Clear
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 7,
          padding: 8,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 18,
          boxShadow: "0 8px 24px rgba(99, 102, 241, 0.08)",
          border: `2px solid ${color}22`,
        }}
      >
        {cells.map(index => {
          const active = filled.includes(index);
          return (
            <button
              key={index}
              type="button"
              aria-label={`number frame cell ${index + 1}`}
              onClick={() => handleCellClick(index)}
              disabled={disabled}
              style={{
                width: size,
                height: size,
                borderRadius: 12,
                border: active ? `2px solid ${color}` : "2px solid rgba(148,163,184,0.28)",
                background: active ? `linear-gradient(135deg, ${color}, ${secondaryColor})` : "rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: active ? `0 4px 10px ${color}44` : "inset 0 1px 1px rgba(255,255,255,0.4)",
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.18s ease",
                transform: active ? "scale(1.02)" : "scale(1)",
              }}
            />
          );
        })}
      </div>

      {showValue && (
        <div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
          {label ? `${label}: ` : ""}
          {filled.length}
        </div>
      )}
    </div>
  );
}
