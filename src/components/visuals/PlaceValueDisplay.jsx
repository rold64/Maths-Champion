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
    return (
      <div style={{ display:"grid", gridTemplateColumns:"repeat(10, 8px)", gap:3, padding:3,
        borderRadius:4, background:`${color}08` }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} style={{ width:8, height:8, borderRadius:2, background:color, opacity:0.7 }} />
        ))}
      </div>
    );
  }
  if (type === "tens") {
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:1, padding:"2px 3px",
        border:`2px solid ${color}`, borderRadius:4, background:`${color}08` }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ width:5, height:5, borderRadius:1, background:color, opacity:0.7 }} />
        ))}
      </div>
    );
  }
  if (type === "ones") {
    return (
      <div style={{ width:8, height:8, borderRadius:2, background:color, opacity:0.7 }} />
    );
  }
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

  let cols = [];
  if (isDecimal) {
    const [intStr, decStr = ""] = String(number).split(".");
    const intDigits  = intStr.split("").reverse();
    const decDigits  = decStr.split("");
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

      <div style={{
        display:"flex", gap:8, alignItems:"stretch", justifyContent:"center",
      }}>
        {cols.map(({ name, digit }) => {
          const c        = COL_COLORS[name] || color;
          const isTarget = name === askCol;
          return (
            <div key={name} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              padding:"8px 10px", borderRadius:14,
              background: isTarget ? `${c}12` : `${c}08`,
              border: isTarget ? `2.5px solid ${c}55` : "2px solid rgba(0,0,0,0.06)",
              boxShadow: isTarget
                ? `0 2px 8px ${c}20, 0 0 0 3px ${c}10`
                : "0 2px 6px rgba(0,0,0,0.04)",
              transition:"all 0.3s",
              minWidth:48,
            }}>
              <div style={{
                fontFamily:"'Fredoka', sans-serif", fontSize:10, fontWeight:700,
                color: isTarget ? c : "#94a3b8", textTransform:"uppercase", letterSpacing:0.5,
              }}>{name}</div>

              <div style={{
                display:"flex", flexDirection: name === "ones" ? "column" : "row",
                flexWrap: name === "ones" ? undefined : "wrap",
                gap:2, alignItems:"center", justifyContent:"center",
                minHeight:16, flex:1,
              }}>
                {Array.from({ length: Math.min(digit, 9) }).map((_, i) => (
                  <Block key={i} type={name} color={c} />
                ))}
                {digit === 0 && (
                  <div style={{ width:16, height:16, borderRadius:4, background:`${c}12`, border:`2px dashed ${c}30` }} />
                )}
              </div>

              <div style={{
                fontFamily:"'Fredoka', sans-serif", fontSize:18, fontWeight:700,
                color: isTarget ? c : "#64748b",
                background: isTarget ? `${c}15` : "rgba(0,0,0,0.03)",
                borderRadius:8, padding:"2px 10px", minWidth:32, textAlign:"center",
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

      {isDecimal && (
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:12, color:"#94a3b8" }}>
          ← whole number · decimal →
        </div>
      )}
    </div>
  );
}
