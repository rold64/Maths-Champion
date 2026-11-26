import { OPERATIONS } from "../data/operations.js";
import { getCoins, getDiamonds } from "../utils/storage.js";
import GoldCoin from "../components/GoldCoin.jsx";
import SoundEngine from "../sounds/SoundEngine.js";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap";

export default function Homepage({ onPractice, onLearn }) {
  const core    = OPERATIONS.filter(o => !o.isFamily && !o.isExplorMore);
  const family  = OPERATIONS.filter(o => o.isFamily);
  const explore = OPERATIONS.filter(o => o.isExplorMore);

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(145deg, #edf2f7 0%, #dfe5ec 100%)",
      fontFamily:"'Fredoka', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"30px 16px", position:"relative", overflow:"hidden",
    }}>
      <link href={FONT_LINK} rel="stylesheet" />

      <div style={{ position:"fixed", top:-120, right:-120, width:280, height:280, borderRadius:"50%", background:"rgba(148,163,184,0.08)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-100, left:-100, width:220, height:220, borderRadius:"50%", background:"rgba(148,163,184,0.06)", pointerEvents:"none" }} />

      <div style={{ textAlign:"center", maxWidth:960, width:"100%", animation:"fadeUp 0.5s ease" }}>
        <div style={{ fontSize:64, marginBottom:8, animation:"bounce 2s ease-in-out infinite" }}>🧮</div>
        <h1 style={{
          fontSize:40, fontWeight:700, margin:"0 0 6px", lineHeight:1.1,
          color:"#1e293b", letterSpacing:"-0.5px",
        }}>Maths Champion</h1>
        <p style={{ color:"#64748b", fontSize:18, margin:"0 0 20px", fontWeight:500 }}>
          Choose your challenge and become a superstar!
        </p>

        {(getCoins() > 0 || getDiamonds() > 0) && (
          <div style={{
            background:"rgba(255,255,255,0.7)", backdropFilter:"blur(6px)",
            borderRadius:16, padding:"10px 20px", marginBottom:22,
            display:"inline-flex", alignItems:"center", gap:14,
            border:"2px solid rgba(245,158,11,0.2)", boxShadow:"0 4px 12px rgba(245,158,11,0.08)",
          }}>
            {getCoins() > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <GoldCoin size={28} />
                <span style={{ fontSize:24, fontWeight:700, color:"#d97706" }}>{getCoins()}</span>
              </div>
            )}
            {getDiamonds() > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:24 }}>💎</span>
                <span style={{ fontSize:24, fontWeight:700, color:"#6366f1" }}>{getDiamonds()}</span>
              </div>
            )}
          </div>
        )}

        {/* Core 4 operations */}
        <SectionLabel>⚡ Core Maths</SectionLabel>
        <div className="homepage-grid core-grid">
          {core.map((op, i) => (
            <OpCard key={op.id} op={op} delay={i * 0.07} onPractice={onPractice} onLearn={onLearn} />
          ))}
        </div>

        {/* Fact families */}
        <SectionLabel>🌟 Fact Family Challenges</SectionLabel>
        <div className="homepage-grid family-grid">
          {family.map((op, i) => (
            <OpCard key={op.id} op={op} delay={(i + 4) * 0.07} onPractice={onPractice} onLearn={onLearn} isFamily />
          ))}
        </div>

        {/* Explore more */}
        <SectionLabel>🔍 Explore More</SectionLabel>
        <div className="homepage-grid explore-grid">
          {explore.map((op, i) => (
            <OpCard key={op.id} op={op} delay={(i + 6) * 0.07} onPractice={onPractice} onLearn={onLearn} />
          ))}
        </div>

        <div style={{
          padding:"14px 20px", borderRadius:16,
          background:"rgba(255,255,255,0.5)", backdropFilter:"blur(6px)",
          border:"2px dashed #e2e8f0",
        }}>
          <div style={{ fontSize:14, color:"#94a3b8", fontWeight:500 }}>
            💡 <strong style={{ color:"#64748b" }}>Tip for parents:</strong> Tap <strong style={{ color:"#6366f1" }}>Learn</strong> for a guided lesson, then <strong style={{ color:"#10b981" }}>Practice</strong> to test your skills!
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
        .homepage-grid {
          display:grid;
          gap:14px;
          margin-bottom:24px;
        }
        .core-grid { grid-template-columns:repeat(5, minmax(0, 1fr)); }
        .family-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
        .explore-grid { grid-template-columns:repeat(4, minmax(0, 1fr)); margin-bottom:28px; }

        @media (max-width:900px) {
          .core-grid { grid-template-columns:repeat(3, minmax(0, 1fr)); }
          .explore-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width:520px) {
          .core-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
          .family-grid { grid-template-columns:1fr; }
          .explore-grid { grid-template-columns:repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width:380px) {
          .core-grid,
          .family-grid,
          .explore-grid { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:600,
      color:"#94a3b8", textTransform:"uppercase", letterSpacing:1.5,
      marginBottom:10,
    }}>{children}</div>
  );
}

function OpCard({ op, delay, onPractice, onLearn, isFamily }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      gap:0, padding:"18px 12px 14px", borderRadius:18,
      border:"1px solid #dce4ee",
      background:"#fff",
      boxShadow:"0 4px 12px rgba(51,65,85,0.05)",
      animation:`fadeUp 0.5s ease ${delay}s both`,
      transition:"all 0.25s",
    }}>
      {/* Icon */}
      <div style={{
        width:52, height:52, borderRadius:18,
        background: isFamily
          ? `linear-gradient(135deg, ${op.dotColorA}20, ${op.dotColorB}20)`
          : `${op.color}15`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:26, border:`2px solid ${op.color}22`, marginBottom:6,
      }}>{op.emoji}</div>

      <div style={{ fontFamily:"Arial, sans-serif", fontSize:20, fontWeight:700, color:"#1b2b5b", marginBottom:2, textAlign:"center" }}>{op.name}</div>
      <div style={{ fontFamily:"Arial, sans-serif", fontSize:14, lineHeight:1.35, color:"#475569", fontWeight:500, marginBottom:12, textAlign:"center" }}>{op.tagline}</div>

      {/* Learn + Practice buttons */}
      <div style={{ display:"flex", gap:6, width:"100%" }}>
        {op.id !== "tenframe" && (
          <button
            onClick={() => { SoundEngine.navigate(); onLearn(op.id); }}
            style={{
              flex:1, padding:"8px 4px", borderRadius:12, border:`2px solid ${op.color}44`,
              background:"rgba(255,255,255,0.8)", cursor:"pointer",
              fontFamily:"Arial, sans-serif", fontSize:13, fontWeight:700,
              color:op.color, transition:"all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${op.color}15`; e.currentTarget.style.borderColor = op.color; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = `${op.color}44`; }}
          >
            📖 Learn
          </button>
        )}
        <button
          onClick={() => { SoundEngine.selectChallenge(); onPractice(op.id); }}
          style={{
            flex:1, padding:"8px 4px", borderRadius:12, border:"none",
            background:op.gradient, cursor:"pointer",
            fontFamily:"Arial, sans-serif", fontSize:13, fontWeight:700,
            color:"white", boxShadow:`0 3px 10px ${op.color}44`, transition:"all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          ⚡ Practice
        </button>
      </div>
    </div>
  );
}
