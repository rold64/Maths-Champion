import MiniEq from "../MiniEq.jsx";

export default function FactFamilyTriangle({ family, opType, colorA, colorB }) {
  const { x, y, total } = family;
  const isAddSub = opType === "addsub";
  const opSymbols = isAddSub ? ["+", "−"] : ["×", "÷"];

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:14 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:500, color:"#94a3b8", marginBottom:6 }}>
        Fact Family
      </div>
      <svg width="180" height="140" viewBox="0 0 180 140" style={{ overflow:"visible" }}>
        <polygon points="90,12 20,125 160,125" fill={`${colorA}08`} stroke={colorA} strokeWidth="3" strokeLinejoin="round" opacity="0.35" />

        <circle cx="90" cy="14" r="24" fill="white" stroke={colorA} strokeWidth="2.5" />
        <text x="90" y="20" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="20" fontWeight="700" fill={colorA}>{total}</text>

        <circle cx="24" cy="122" r="22" fill="white" stroke={colorB} strokeWidth="2.5" />
        <text x="24" y="128" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill={colorB}>{x}</text>

        <circle cx="156" cy="122" r="22" fill="white" stroke={colorB} strokeWidth="2.5" />
        <text x="156" y="128" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill={colorB}>{y}</text>

        <text x="48"  y="66" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="600" fill="#94a3b8">{opSymbols[0]}</text>
        <text x="132" y="66" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontSize="16" fontWeight="600" fill="#94a3b8">{opSymbols[1]}</text>
      </svg>

      <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", marginTop:6 }}>
        {isAddSub ? (
          <>
            <MiniEq text={`${x}+${y}=${total}`}  c={colorA} />
            <MiniEq text={`${y}+${x}=${total}`}  c={colorA} />
            <MiniEq text={`${total}−${x}=${y}`}  c={colorB} />
            <MiniEq text={`${total}−${y}=${x}`}  c={colorB} />
          </>
        ) : (
          <>
            <MiniEq text={`${x}×${y}=${total}`}  c={colorA} />
            <MiniEq text={`${y}×${x}=${total}`}  c={colorA} />
            <MiniEq text={`${total}÷${x}=${y}`}  c={colorB} />
            <MiniEq text={`${total}÷${y}=${x}`}  c={colorB} />
          </>
        )}
      </div>
    </div>
  );
}
