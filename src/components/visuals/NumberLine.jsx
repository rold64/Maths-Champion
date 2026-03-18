// NumberLine: shows addition (jump forward) or subtraction (jump back) on a number line
export default function NumberLine({ a, b, operation, color }) {
  const answer = operation === "addition" ? a + b : a - b;
  const start  = operation === "addition" ? a : a;
  const end    = answer;
  const min    = 0;
  const max    = Math.max(a + b + 1, 12);

  const svgW   = 300;
  const svgH   = 80;
  const padL   = 20;
  const padR   = 20;
  const lineY  = 50;
  const lineW  = svgW - padL - padR;
  const step   = lineW / max;

  function xOf(n) { return padL + n * step; }

  // Arc path from start to end
  const x1 = xOf(operation === "addition" ? a : a);
  const x2 = xOf(end);
  const arcH = 28;
  const mx   = (x1 + x2) / 2;
  const arcDir = operation === "addition" ? 1 : 0; // 1 = right arc, 0 = left arc

  // SVG arc: always curves upward (above the line)
  const arcPath = `M ${x1} ${lineY} Q ${mx} ${lineY - arcH} ${x2} ${lineY}`;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:12 }}>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:500, color:"#94a3b8", marginBottom:4 }}>
        {operation === "addition" ? `Start at ${a}, count on ${b}` : `Start at ${a}, count back ${b}`}
      </div>
      <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:14, padding:"8px 10px", boxShadow:`0 2px 10px ${color}22` }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {/* Base line */}
          <line x1={padL} y1={lineY} x2={svgW - padR} y2={lineY} stroke="#cbd5e1" strokeWidth="2" />

          {/* Tick marks and labels */}
          {Array.from({ length: max + 1 }).map((_, n) => {
            const x = xOf(n);
            const isKey = n === 0 || n === a || n === end;
            return (
              <g key={n}>
                <line x1={x} y1={lineY - (isKey ? 7 : 4)} x2={x} y2={lineY + (isKey ? 7 : 4)}
                  stroke={isKey ? color : "#94a3b8"} strokeWidth={isKey ? 2.5 : 1} />
                {(isKey || n % Math.max(1, Math.floor(max / 10)) === 0) && (
                  <text x={x} y={lineY + 18} textAnchor="middle"
                    fontFamily="Fredoka, sans-serif" fontSize={isKey ? 13 : 10}
                    fontWeight={isKey ? "700" : "400"}
                    fill={isKey ? color : "#94a3b8"}>{n}</text>
                )}
              </g>
            );
          })}

          {/* Jump arc */}
          <path d={arcPath} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={b > 1 ? "none" : "4 2"} />
          {/* Arrowhead at end */}
          <polygon
            points={`${x2},${lineY} ${x2 - 6},${lineY - 8} ${x2 + 6},${lineY - 8}`}
            fill={color}
          />

          {/* Start dot */}
          <circle cx={x1} cy={lineY} r="6" fill={color} opacity="0.5" />
          {/* End dot */}
          <circle cx={x2} cy={lineY} r="7" fill={color} />

          {/* Jump label */}
          <text x={mx} y={lineY - arcH - 4} textAnchor="middle"
            fontFamily="Fredoka, sans-serif" fontSize="13" fontWeight="700" fill={color}>
            {operation === "addition" ? `+${b}` : `−${b}`}
          </text>
        </svg>
      </div>
    </div>
  );
}
