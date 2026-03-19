export default function MiniEq({ text, c }) {
  return (
    <div style={{
      background: `${c}12`, borderRadius: 8, padding: "3px 10px",
      fontFamily: "'Fredoka', sans-serif", fontSize: 13, fontWeight: 600,
      color: c, border: `1.5px solid ${c}25`,
    }}>{text}</div>
  );
}
