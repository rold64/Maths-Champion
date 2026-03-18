// PlaceValueDisplay: shows Dienes-style blocks for a number, highlighting a column
const COL_COLORS = {
  thousands: "#7c3aed",
  hundreds:  "#0284c7",
  tens:      "#16a34a",
  ones:      "#e11d48",
  tenths:    "#f59e0b",
  hundredths:"#10b981",
};

function Block({ type, color }) {
  if (type === "thousands") {
    // 2×2 grid of mini hundreds squares
    return (
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1.5, padding:2,
        border:`2px solid ${color}`, borderRadius:4, background:`${color}08` }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0.5 }}>
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} style={{ width:2.5, height:2.5, borderRadius:0.5, background:color, opacity:0.7 }} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (type === "hundreds") {
    // 10×10 square grid — compact and clearly square
    return (
      <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:0.8, padding:2,
        border:`2px solid ${color}`, borderRadius:4, background:`${color}08` }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} style={{ width:2.5, height:2.5, borderRadius:0.5, background:color, opacity:0.7 }} />
        ))}
      </div>
    );
  }
  if (type === "tens") {
    // Slim vertical rod of 10 squares
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:1, padding:"2px 3px",
        border:`2px solid ${color}`, borderRadius:4, background:`${color}08` }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width:5, height:5, borderRadius:1, background:color, opacity:0.7 }} />
        ))}
      </div>
    );
  }
  // ones / tenths / hundredths
  return (
    <div style={{
      width:13, height:13, borderRadius:3, background:color, opacity:0.85,
      border:`2px solid ${color}`,
    }} />
  );
}

export default function PlaceValueDisplay({ number, askCol, qType, color }) {
  const isDecimal = String(number).includes(".");
  const numStr    = isDecimal ? String(number) : String(Math.abs(Math.round(number)));

  // Parse digits
  let cols = [];
  if (isDecimal) {
    const [intStr, decStr = ""] = String(number).split(".");
    const intDigits  = intStr.split("").reverse(); // [ones, tens, hundreds, ...]
    const decDigits  = decStr.split("");            // [tenths, hundredths, ...]
    if (intDigits[3]) cols.push({ name:"thousands", digit: parseInt(intDigits[3]) || 0 });
    if (intDigits[2]) cols.push({ name:"hundreds",  digit: parseInt(intDigits[2]) || 0 });
    if (intDigits[1]) cols.push({ name:"tens",       digit: parseInt(intDigits[1]) || 0 });
    cols.push({ name:"ones",       digit: parseInt(intDigits[0]) || 0 });
    cols.push({ name:"tenths",     digit: parseInt(decDigits[0]) || 0 });
    if (decDigits[1] !== undefined) cols.push({ name:"hundredths", digit: parseInt(decDigits[1]) || 0 });
  } else {
    const digits = numStr.split("").reverse();
    const names  = ["ones","tens","hundreds","thousands"];
    cols = digits.map((d, i) => ({ name: names[i], digit: parseInt(d) })).reverse();
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:12 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:22, fontWeight:700, color:"#1e293b", letterSpacing:4 }}>
        {number}
      </div>

      {/* Column headers + digit cells */}
      <div style={{
        background:"rgba(255,255,255,0.7)", borderRadius:14, padding:"10px 14px",
        display:"flex", gap:6, alignItems:"flex-end",
        boxShadow:`0 2px 10px ${color}22`,
      }}>
        {cols.map(({ name, digit }) => {
          const c        = COL_COLORS[name] || color;
          const isTarget = name === askCol;
          return (
            <div key={name} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:5,
              padding:"6px 8px", borderRadius:10,
              background: isTarget ? `${c}15` : "transparent",
              border: isTarget ? `2px solid ${c}` : "2px solid transparent",
              transition:"all 0.3s",
            }}>
              <div style={{
                fontFamily:"'Fredoka', sans-serif", fontSize:10, fontWeight:600,
                color: isTarget ? c : "#94a3b8", textTransform:"uppercase", letterSpacing:0.5,
              }}>{name}</div>

              {/* Dienes blocks — show up to 9, wrap to avoid overflow */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:2, alignItems:"flex-end", justifyContent:"center", maxWidth:90, minHeight:16 }}>
                {Array.from({ length: Math.min(digit, 9) }).map((_, i) => (
                  <Block key={i} type={name} color={c} />
                ))}
                {digit === 0 && (
                  <div style={{ width:16, height:16, borderRadius:4, background:`${c}18`, border:`2px dashed ${c}44` }} />
                )}
              </div>

              <div style={{
                fontFamily:"'Fredoka', sans-serif", fontSize:20, fontWeight:700,
                color: isTarget ? c : "#64748b",
                background: isTarget ? `${c}18` : "transparent",
                borderRadius:8, padding:"2px 8px", minWidth:32, textAlign:"center",
              }}>{digit}</div>

              {isTarget && qType === "value" && (
                <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:11, color:c, fontWeight:600 }}>
                  = {digit * { ones:1,tens:10,hundreds:100,thousands:1000,tenths:0.1,hundredths:0.01 }[name]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decimal point marker */}
      {isDecimal && (
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:12, color:"#94a3b8" }}>
          ← whole number · decimal →
        </div>
      )}
    </div>
  );
}
