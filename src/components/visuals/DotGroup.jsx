export default function DotGroup({ count, color, label }) {
  const rows = [];
  let remaining = count;
  while (remaining > 0) {
    const inRow = Math.min(remaining, 5);
    rows.push(inRow);
    remaining -= inRow;
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:26, fontWeight:600, color, marginBottom:2 }}>{label}</div>
      <div style={{
        background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 14px",
        display:"flex", flexDirection:"column", alignItems:"center", gap:5,
        minWidth:70, boxShadow:`0 2px 10px ${color}33`, border:`2px solid ${color}44`,
      }}>
        {rows.map((n, ri) => (
          <div key={ri} style={{ display:"flex", gap:5 }}>
            {Array.from({ length: n }).map((_, ci) => (
              <div key={ci} style={{
                width:16, height:16, borderRadius:"50%", background:color,
                boxShadow:`0 2px 4px ${color}66`,
                animation:`popIn 0.3s ease-out ${(ri*5+ci)*0.04}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
