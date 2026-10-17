// NumberBond: part-part-whole diagram showing total at top, two parts below
export default function NumberBond({ total, partA, partB, missing, colorA, colorB }) {
  const hiddenA = missing === "partA";
  const hiddenB = missing === "partB";

  const circleStyle = (val, color, hidden) => ({
    width: 52, height: 52, borderRadius: "50%",
    background: hidden ? "rgba(255,255,255,0.3)" : `${color}18`,
    border: `3px ${hidden ? "dashed" : "solid"} ${color}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 22,
    color: hidden ? `${color}66` : color,
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, marginBottom:14 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>
        Number Bond
      </div>

      {/* Total (whole) */}
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        background: `${colorA}18`, border: `3px solid ${colorA}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Fredoka', sans-serif", fontWeight:700, fontSize:26, color:colorA,
      }}>{total}</div>

      {/* Connecting lines */}
      <svg width="120" height="34" viewBox="0 0 120 34" style={{ display:"block" }}>
        <line x1="60" y1="0" x2="25"  y2="34" stroke="#cbd5e1" strokeWidth="2.5" />
        <line x1="60" y1="0" x2="95" y2="34" stroke="#cbd5e1" strokeWidth="2.5" />
      </svg>

      {/* Parts */}
      <div style={{ display:"flex", gap:16 }}>
        <div style={circleStyle(partA, colorA, hiddenA)}>
          {hiddenA ? "?" : partA}
        </div>
        <div style={circleStyle(partB, colorB, hiddenB)}>
          {hiddenB ? "?" : partB}
        </div>
      </div>

      <div style={{ marginTop:10, fontFamily:"'Fredoka', sans-serif", fontSize:14, color:"#64748b", fontWeight:500 }}>
        {hiddenA
          ? `? + ${partB} = ${total}`
          : `${partA} + ? = ${total}`}
      </div>
    </div>
  );
}
