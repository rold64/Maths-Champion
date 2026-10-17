import { OPERATIONS } from "../data/operations.js";
import { LEVELS }     from "../data/levels.js";
import { getRecord }  from "../utils/storage.js";
import SoundEngine    from "../sounds/SoundEngine.js";

export default function LevelSelect({ opId, onSelectLevel, onBack }) {
  const op     = OPERATIONS.find(o => o.id === opId);
  const levels = LEVELS[opId] || [];

  return (
    <div style={{
      minHeight:"100vh", background:op.bg, fontFamily:"'Fredoka', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"24px 16px", position:"relative",
    }}>
      <div style={{ textAlign:"center", maxWidth:420, width:"100%", animation:"fadeUp 0.4s ease" }}>
        <button onClick={() => { SoundEngine.navigate(); onBack(); }} style={{
          background:"rgba(255,255,255,0.7)", border:"none", borderRadius:12,
          padding:"8px 16px", fontFamily:"'Fredoka', sans-serif", fontWeight:600,
          color:"#64748b", cursor:"pointer", fontSize:14, marginBottom:16,
        }}>← Home</button>

        <div style={{ fontSize:48, marginBottom:8 }}>{op.emoji}</div>
        <h2 style={{ fontSize:32, fontWeight:700, color:op.color, margin:"0 0 4px" }}>{op.name}</h2>
        <p style={{ color:"#64748b", fontSize:16, margin:"0 0 8px", fontWeight:500 }}>{op.tagline}</p>

        {op.isFamily && (
          <div style={{
            background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 16px",
            marginBottom:16, border:`2px solid ${op.color}20`,
          }}>
            <div style={{ fontSize:13, color:"#64748b", fontWeight:500, lineHeight:1.5 }}>
              {opId === "addsub"
                ? "🧩 Every addition has a matching subtraction! If 3+5=8, then 8−5=3 and 8−3=5."
                : "🧩 Every multiplication has a matching division! If 3×4=12, then 12÷4=3 and 12÷3=4."}
            </div>
          </div>
        )}

        <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:12 }}>
          {levels.map((l, i) => {
            const record  = getRecord(opId, i);
            const hasBest = record.bestScore > 0;
            return (
              <button key={i}
                onClick={() => { SoundEngine.selectLevel(); onSelectLevel(i); }}
                style={{
                  display:"flex", alignItems:"center", gap:16, padding:"16px 24px",
                  borderRadius:20, border:`3px solid ${l.color}33`,
                  background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)",
                  cursor:"pointer", transition:"all 0.2s", boxShadow:`0 4px 10px rgba(0,0,0,0.06), 0 8px 24px ${l.color}20`,
                  animation:`fadeUp 0.4s ease ${i * 0.08}s both`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.borderColor = l.color; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.borderColor = `${l.color}33`; }}
              >
                <span style={{ fontSize:36 }}>{l.emoji}</span>
                <div style={{ textAlign:"left", flex:1 }}>
                  <div style={{ fontSize:20, fontWeight:700, color:"#1e293b" }}>{l.name}</div>
                  <div style={{ fontSize:14, color:"#94a3b8", fontWeight:500 }}>{l.label}</div>
                  {hasBest && (
                    <div style={{ fontSize:12, color:l.color, fontWeight:600, marginTop:2 }}>
                      Best: {record.bestScore}/10 · Played {record.gamesPlayed}×
                    </div>
                  )}
                </div>
                <div style={{
                  width:40, height:40, borderRadius:12,
                  background:`${l.color}18`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:20, color:l.color, fontWeight:700,
                }}>→</div>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
