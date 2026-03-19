export default function MultiplicationDots({ a, b, color }) {
  if (a * b > 60) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBottom:12 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, fontWeight:500, color:"#94a3b8" }}>
        {a} groups of {b}
      </div>
      <div style={{
        background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"12px 20px",
        textAlign:"center", boxShadow:`0 2px 10px ${color}22`,
      }}>
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:16, fontWeight:600, color, marginBottom:4 }}>
          {b} + {b} + {b}… ({a} times)
        </div>
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:12, color:"#94a3b8" }}>
          Count up in {b}s, {a} times
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBottom:12 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:2 }}>
        {a} groups of {b}
      </div>
      <div style={{
        background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 14px",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8,
        boxShadow:`0 2px 10px ${color}22`,
      }}>
        {Array.from({ length: a }).map((_, ri) => (
          <div key={ri} style={{ display:"flex", gap:5, padding:"3px 6px", borderRadius:8, background:`${color}11` }}>
            {Array.from({ length: b }).map((_, ci) => (
              <div key={ci} style={{
                width:14, height:14, borderRadius:"50%", background:color,
                animation:`popIn 0.25s ease-out ${(ri*b+ci)*0.03}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
