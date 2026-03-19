import { OPERATIONS } from "../data/operations.js";
import SoundEngine from "../sounds/SoundEngine.js";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap";

export default function Homepage({ onPractice, onLearn }) {
  const core    = OPERATIONS.filter(o => !o.isFamily && !o.isExplorMore);
  const family  = OPERATIONS.filter(o => o.isFamily);
  const explore = OPERATIONS.filter(o => o.isExplorMore);

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg, #fef9c3 0%, #fce7f3 25%, #dbeafe 50%, #d1fae5 75%, #fef3c7 100%)",
      fontFamily:"'Fredoka', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"30px 16px", position:"relative", overflow:"hidden",
    }}>
      <link href={FONT_LINK} rel="stylesheet" />

      {/* Background blobs */}
      <div style={{ position:"fixed", top:-80, right:-80, width:250, height:250, borderRadius:"50%", background:"rgba(251,191,36,0.12)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:-60, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(96,165,250,0.1)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"50%", right:-30, width:140, height:140, borderRadius:"50%", background:"rgba(52,211,153,0.08)", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"20%", left:-40, width:120, height:120, borderRadius:"50%", background:"rgba(236,72,153,0.08)", pointerEvents:"none" }} />

      <div style={{ textAlign:"center", maxWidth:480, width:"100%", animation:"fadeUp 0.5s ease" }}>
        <div style={{ fontSize:64, marginBottom:8, animation:"bounce 2s ease-in-out infinite" }}>🧮</div>
        <h1 style={{
          fontSize:40, fontWeight:700, margin:"0 0 6px", lineHeight:1.1,
          background:"linear-gradient(135deg, #f59e0b, #ec4899, #6366f1, #10b981)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>Maths Champion</h1>
        <p style={{ color:"#64748b", fontSize:18, margin:"0 0 28px", fontWeight:500 }}>
          Choose your challenge and become a superstar!
        </p>

        {/* Core 4 operations */}
        <SectionLabel>⚡ Core Maths</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {core.map((op, i) => (
            <OpCard key={op.id} op={op} delay={i * 0.07} onPractice={onPractice} onLearn={onLearn} />
          ))}
        </div>

        {/* Fact families */}
        <SectionLabel>🌟 Fact Family Challenges</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {family.map((op, i) => (
            <OpCard key={op.id} op={op} delay={(i + 4) * 0.07} onPractice={onPractice} onLearn={onLearn} isFamily />
          ))}
        </div>

        {/* Explore more */}
        <SectionLabel>🔍 Explore More</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:28 }}>
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
      gap:0, padding:"18px 12px 14px", borderRadius:24,
      border:`3px solid ${op.color}22`,
      background: isFamily
        ? `linear-gradient(145deg, rgba(255,255,255,0.85), ${op.color}08)`
        : "rgba(255,255,255,0.75)",
      backdropFilter:"blur(8px)",
      boxShadow:`0 6px 24px ${op.color}15`,
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

      <div style={{ fontSize:16, fontWeight:700, color:"#1e293b", marginBottom:2, textAlign:"center" }}>{op.name}</div>
      <div style={{ fontSize:11, color:"#94a3b8", fontWeight:500, marginBottom:12, textAlign:"center" }}>{op.tagline}</div>

      {/* Learn + Practice buttons */}
      <div style={{ display:"flex", gap:6, width:"100%" }}>
        <button
          onClick={() => { SoundEngine.navigate(); onLearn(op.id); }}
          style={{
            flex:1, padding:"8px 4px", borderRadius:12, border:`2px solid ${op.color}44`,
            background:"rgba(255,255,255,0.8)", cursor:"pointer",
            fontFamily:"'Fredoka', sans-serif", fontSize:12, fontWeight:600,
            color:op.color, transition:"all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${op.color}15`; e.currentTarget.style.borderColor = op.color; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = `${op.color}44`; }}
        >
          📖 Learn
        </button>
        <button
          onClick={() => { SoundEngine.selectChallenge(); onPractice(op.id); }}
          style={{
            flex:1, padding:"8px 4px", borderRadius:12, border:"none",
            background:op.gradient, cursor:"pointer",
            fontFamily:"'Fredoka', sans-serif", fontSize:12, fontWeight:700,
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
