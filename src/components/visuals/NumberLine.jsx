// NumberLine: shows addition (jump forward) or subtraction (jump back) on a number line

// "Nice" tick intervals — avoids overcrowding (1, 2, 5, 10, 20, 25, 50)
function niceInterval(max) {
  const rough = max / 8;
  const nice  = [1, 2, 5, 10, 20, 25, 50];
  return nice.find(n => n >= rough) || 50;
}

export default function NumberLine({ a, b, operation, color }) {
  const answer = operation === "addition" ? a + b : a - b;
  const end    = answer;

  // For subtraction only need 0..a; for addition 0..(a+b)
  const rawMax = operation === "addition" ? answer + 2 : a + 2;
  const max    = Math.max(rawMax, 12);

  const svgW  = 300;
  const svgH  = 85;
  const padL  = 20;
  const padR  = 20;
  const lineY = 54;
  const lineW = svgW - padL - padR;
  const step  = lineW / max;

  function xOf(n) { return padL + n * step; }

  const tickInterval = niceInterval(max);
  const keyPositions = [0, a, end].filter((v, i, arr) => arr.indexOf(v) === i);

  // If start and end key labels are too close, stagger the start label above the line
  const startEndClose = Math.abs(xOf(a) - xOf(end)) < 20;

  // Suppress a regular tick label if it's within 14px of any key position
  function tooCloseToKey(n) {
    return keyPositions.some(k => k !== n && Math.abs(xOf(k) - xOf(n)) < 14);
  }

  // Key label y: start goes above the line when too close to end, otherwise below
  function keyLabelY(n) {
    if (startEndClose && n === a) return lineY - 22;
    return lineY + 18;
  }

  const x1      = xOf(a);
  const x2      = xOf(end);
  const arcH    = 26;
  const mx      = (x1 + x2) / 2;
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

          {/* Tick marks and labels — only drawn at labeled positions */}
          {Array.from({ length: max + 1 }).map((_, n) => {
            const x         = xOf(n);
            const isKey     = keyPositions.includes(n);
            const showLabel = isKey || (n % tickInterval === 0 && !tooCloseToKey(n));
            if (!showLabel) return null;
            return (
              <g key={n}>
                <line
                  x1={x} y1={lineY - (isKey ? 7 : 4)}
                  x2={x} y2={lineY + (isKey ? 7 : 4)}
                  stroke={isKey ? color : "#94a3b8"}
                  strokeWidth={isKey ? 2.5 : 1}
                />
                <text x={x} y={isKey ? keyLabelY(n) : lineY + 18}
                  textAnchor="middle"
                  fontFamily="Fredoka, sans-serif"
                  fontSize={isKey ? 13 : 10}
                  fontWeight={isKey ? "700" : "400"}
                  fill={isKey ? color : "#94a3b8"}>
                  {n}
                </text>
              </g>
            );
          })}

          {/* Jump arc */}
          <path d={arcPath} fill="none" stroke={color} strokeWidth="2.5" />
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
