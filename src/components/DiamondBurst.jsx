export default function DiamondBurst({ x, y, tx, ty, amount }) {
  const count = 4;
  const scatterAngles = [-120, -100, -80, -60];
  const scatterDist = [35, 45, 45, 35];
  const delays = [0, 0.06, 0.12, 0.18];

  const dx = tx - (x - 30);
  const dy = ty - (y - 30);

  return (
    <div style={{ position:"fixed", left:x-30, top:y-30, pointerEvents:"none", zIndex:10000 }}>
      {Array.from({ length: count }).map((_, i) => {
        const rad = (scatterAngles[i] * Math.PI) / 180;
        const sx = Math.cos(rad) * scatterDist[i];
        const sy = Math.sin(rad) * scatterDist[i];
        return (
          <div key={i} style={{
            position:"absolute", width:16, height:16,
            background:"linear-gradient(135deg, #60A5FA, #818CF8)",
            border:"1.5px solid #4F46E5",
            boxShadow:"0 0 8px rgba(96,165,250,0.6)",
            transform:"rotate(45deg)",
            borderRadius:2,
            animation: `diamondArc-${i} 1s cubic-bezier(0.2,0.8,0.3,1) ${delays[i]}s forwards`,
          }} />
        );
      })}
      <div style={{
        position:"absolute", left:14, top:6,
        fontSize:22, fontWeight:700, color:"#818CF8",
        textShadow:"0 1px 4px rgba(99,102,241,0.3)",
        fontFamily:"'Fredoka', sans-serif",
        animation:"diamondText 0.8s ease-out forwards",
      }}>+{amount} 💎</div>
      <style>{
        scatterAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const sx = Math.cos(rad) * scatterDist[i];
          const sy = Math.sin(rad) * scatterDist[i];
          return `@keyframes diamondArc-${i} {
            0%   { transform: translate(30px, 30px) rotate(45deg) scale(0.5); opacity: 0; }
            20%  { transform: translate(${30 + sx}px, ${30 + sy}px) rotate(45deg) scale(1.3); opacity: 1; }
            100% { transform: translate(${dx}px, ${dy}px) rotate(45deg) scale(0.6); opacity: 0.3; }
          }`;
        }).join("\n") +
        `\n@keyframes diamondText {
          0%   { transform: translateY(0) scale(0.8); opacity: 0; }
          20%  { transform: translateY(-5px) scale(1.1); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateY(-45px) scale(1); opacity: 0; }
        }`
      }</style>
    </div>
  );
}
