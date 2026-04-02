export default function StarBurst({ x, y }) {
  const colors = ["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#F7DC6F","#BB8FCE"];
  return (
    <div style={{ position:"fixed", left:x-30, top:y-30, pointerEvents:"none", zIndex:9999 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position:"absolute", width:10, height:10, borderRadius:"50%",
          background: colors[i % colors.length],
          animation: `burst-${i} 0.6s ease-out forwards`,
        }} />
      ))}
      <style>{Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        const rad   = (angle * Math.PI) / 180;
        const dx    = Math.cos(rad) * 60;
        const dy    = Math.sin(rad) * 60;
        return `@keyframes burst-${i} {
          0%   { transform: translate(30px,30px) scale(1); opacity:1; }
          100% { transform: translate(${30+dx}px,${30+dy}px) scale(0); opacity:0; }
        }`;
      }).join("\n")}</style>
    </div>
  );
}
