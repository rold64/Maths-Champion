export default function DivisionDots({ total, divisor, color }) {
  const groups = total / divisor;
  if (total > 60) return null;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, marginBottom:12 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, fontWeight:500, color:"#94a3b8", marginBottom:2 }}>
        {total} shared into groups of {divisor}
      </div>
      <div style={{
        background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 14px",
        display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8,
        boxShadow:`0 2px 10px ${color}22`,
      }}>
        {Array.from({ length: groups }).map((_, gi) => (
          <div key={gi} style={{
            display:"flex", gap:4, padding:"4px 8px", borderRadius:10,
            border:`2px dashed ${color}55`, background:`${color}08`,
          }}>
            {Array.from({ length: divisor }).map((_, di) => (
              <div key={di} style={{
                width:14, height:14, borderRadius:"50%", background:color,
                animation:`popIn 0.25s ease-out ${(gi*divisor+di)*0.03}s both`,
              }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
