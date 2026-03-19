export default function ProgressBar({ current, total, color }) {
  return (
    <div style={{ width:"100%", height:14, borderRadius:7, background:"#e2e8f0", overflow:"hidden" }}>
      <div style={{
        height:"100%",
        width: `${(current / total) * 100}%`,
        borderRadius: 7,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        transition: "width 0.5s ease",
      }} />
    </div>
  );
}
