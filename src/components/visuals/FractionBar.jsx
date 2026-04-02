// FractionBar: shows a divided bar with numerator parts shaded
export default function FractionBar({ numerator, denominator, color, highlightIndex = null, showLabel = true }) {
  const parts = Array.from({ length: denominator });

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:12 }}>
      {showLabel && (
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:500, color:"#94a3b8" }}>
          {numerator} out of {denominator} equal parts
        </div>
      )}
      <div style={{
        display:"flex", gap:3, padding:"10px 12px",
        background:"rgba(255,255,255,0.7)", borderRadius:14,
        boxShadow:`0 2px 10px ${color}22`,
      }}>
        {parts.map((_, i) => {
          const shaded = i < numerator;
          const highlighted = highlightIndex !== null && i === highlightIndex;
          return (
            <div key={i} style={{
              width: Math.min(44, Math.max(20, 260 / denominator)),
              height: 44,
              borderRadius: 8,
              background: shaded ? color : `${color}18`,
              border: `2px solid ${color}`,
              opacity: highlighted ? 1 : shaded ? 0.85 : 0.4,
              transition: "all 0.3s",
              animation: shaded ? `popIn 0.3s ease-out ${i * 0.06}s both` : "none",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {shaded && (
                <span style={{ color:"white", fontSize:10, fontWeight:700, fontFamily:"'Fredoka', sans-serif" }}>✓</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Fraction notation */}
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        fontFamily:"'Fredoka', sans-serif", fontWeight:700,
      }}>
        <span style={{ fontSize:22, color, lineHeight:1 }}>{numerator}</span>
        <div style={{ width:28, height:2.5, background:color, borderRadius:2, margin:"2px 0" }} />
        <span style={{ fontSize:22, color:`${color}99`, lineHeight:1 }}>{denominator}</span>
      </div>
    </div>
  );
}
