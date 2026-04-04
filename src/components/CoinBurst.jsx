export default function CoinBurst({ x, y, tx, ty, amount }) {
  const count = 5;
  // Small random scatter offsets before converging to target
  const scatterAngles = [-130, -110, -90, -70, -50];
  const scatterDist = [30, 35, 40, 35, 30];
  // Stagger each coin slightly so they don't all arrive at once
  const delays = [0, 0.04, 0.08, 0.12, 0.16];

  // Target position relative to the burst origin (x-30, y-30 is the container origin)
  const dx = tx - (x - 30);
  const dy = ty - (y - 30);

  return (
    <div style={{ position:"fixed", left:x-30, top:y-30, pointerEvents:"none", zIndex:9999 }}>
      {Array.from({ length: count }).map((_, i) => {
        const rad = (scatterAngles[i] * Math.PI) / 180;
        const sx = Math.cos(rad) * scatterDist[i];
        const sy = Math.sin(rad) * scatterDist[i];
        return (
          <div key={i} style={{
            position:"absolute", width:18, height:18, borderRadius:"50%",
            background:"linear-gradient(135deg, #FFD700, #F59E0B)",
            border:"1.5px solid #D97706",
            boxShadow:"0 0 4px rgba(255,215,0,0.5)",
            animation: `coinArc-${i} 0.85s cubic-bezier(0.2,0.8,0.3,1) ${delays[i]}s forwards`,
          }} />
        );
      })}
      <div style={{
        position:"absolute", left:18, top:10,
        fontSize:20, fontWeight:700, color:"#F59E0B",
        textShadow:"0 1px 3px rgba(0,0,0,0.15)",
        fontFamily:"'Fredoka', sans-serif",
        animation:"coinText 0.6s ease-out forwards",
      }}>+{amount}</div>
      <style>{
        scatterAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const sx = Math.cos(rad) * scatterDist[i];
          const sy = Math.sin(rad) * scatterDist[i];
          return `@keyframes coinArc-${i} {
            0%   { transform: translate(30px, 30px) scale(1); opacity: 1; }
            25%  { transform: translate(${30 + sx}px, ${30 + sy}px) scale(1.1); opacity: 1; }
            100% { transform: translate(${dx}px, ${dy}px) scale(0.5); opacity: 0.3; }
          }`;
        }).join("\n") +
        `\n@keyframes coinText {
          0%   { transform: translateY(0); opacity: 1; }
          50%  { opacity: 1; }
          100% { transform: translateY(-35px); opacity: 0; }
        }`
      }</style>
    </div>
  );
}
