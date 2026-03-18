import DotGroup            from "./visuals/DotGroup.jsx";
import MultiplicationDots  from "./visuals/MultiplicationDots.jsx";
import DivisionDots        from "./visuals/DivisionDots.jsx";
import FactFamilyTriangle  from "./visuals/FactFamilyTriangle.jsx";
import NumberLine          from "./visuals/NumberLine.jsx";
import FractionBar         from "./visuals/FractionBar.jsx";
import NumberBond          from "./visuals/NumberBond.jsx";
import PlaceValueDisplay   from "./visuals/PlaceValueDisplay.jsx";
import ClockFace           from "./visuals/ClockFace.jsx";

export default function VisualHelper({ opId, problem, op }) {
  const { a, b } = problem;

  // ── Fact families ──────────────────────────────────────
  if ((opId === "addsub" || opId === "muldiv") && problem.family) {
    return (
      <FactFamilyTriangle
        family={problem.family}
        opType={opId}
        colorA={op.dotColorA}
        colorB={op.dotColorB}
      />
    );
  }

  // ── Number bonds ───────────────────────────────────────
  if (opId === "numbonds") {
    return (
      <NumberBond
        total={problem.total}
        partA={problem.partA}
        partB={problem.partB}
        missing={problem.missing}
        colorA={op.dotColorA}
        colorB={op.dotColorB}
      />
    );
  }

  // ── Place value ────────────────────────────────────────
  if (opId === "placevalue") {
    return (
      <PlaceValueDisplay
        number={problem.number}
        askCol={problem.askCol}
        qType={problem.qType}
        color={op.color}
      />
    );
  }

  // ── Fractions ──────────────────────────────────────────
  if (opId === "fractions") {
    if (problem.fracType === "equivalent") {
      // Show both bars side by side
      return (
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:12 }}>
          <FractionBar numerator={problem.numerator} denominator={problem.denominator} color={op.dotColorA} />
          <div style={{ display:"flex", alignItems:"center", fontFamily:"'Fredoka', sans-serif", fontSize:20, fontWeight:700, color:"#94a3b8" }}>=</div>
          <FractionBar numerator={problem.equivNumerator} denominator={problem.equivDenominator} color={op.dotColorB} />
        </div>
      );
    }
    return (
      <FractionBar
        numerator={problem.numerator}
        denominator={problem.denominator}
        color={op.dotColorA}
      />
    );
  }

  // ── Telling time ───────────────────────────────────────
  if (opId === "time") {
    const highlight = problem.askType === "hour" ? "hour" : "minute";
    return (
      <ClockFace
        hours={problem.hours}
        minutes={problem.minutes}
        color={op.color}
        highlightHand={highlight}
      />
    );
  }

  // ── Standard operations ────────────────────────────────
  switch (opId) {
    case "addition":
      if (a + b > 30) return null;
      return (
        <div style={{ marginBottom:12 }}>
          {/* Number line for larger numbers, dots for small */}
          {a + b > 10 ? (
            <NumberLine a={a} b={b} operation="addition" color={op.dotColorA} />
          ) : (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:16, flexWrap:"wrap" }}>
              <DotGroup count={a} color={op.dotColorA} label={a} />
              <span style={{ fontSize:30, fontWeight:700, color:"#94a3b8", alignSelf:"center" }}>+</span>
              <DotGroup count={b} color={op.dotColorB} label={b} />
            </div>
          )}
        </div>
      );

    case "subtraction":
      if (a > 30) return null;
      return (
        <div style={{ marginBottom:12 }}>
          {a > 10 ? (
            <NumberLine a={a} b={b} operation="subtraction" color={op.dotColorA} />
          ) : (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, fontWeight:500, color:"#94a3b8" }}>
                Start with {a}, take away {b}
              </div>
              <div style={{
                background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 14px",
                display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", maxWidth:200,
                boxShadow:`0 2px 10px ${op.dotColorA}22`,
              }}>
                {Array.from({ length: a }).map((_, i) => (
                  <div key={i} style={{
                    width:16, height:16, borderRadius:"50%",
                    background: i < a - b ? op.dotColorA : op.dotColorB,
                    opacity: i < a - b ? 1 : 0.35,
                    animation:`popIn 0.25s ease-out ${i * 0.03}s both`,
                  }} />
                ))}
              </div>
              <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:12, color:"#94a3b8" }}>
                <span style={{ color:op.dotColorA }}>● keep</span>&nbsp;&nbsp;
                <span style={{ color:op.dotColorB, opacity:0.5 }}>● remove</span>
              </div>
            </div>
          )}
        </div>
      );

    case "multiplication":
      return <MultiplicationDots a={a} b={b} color={op.dotColorA} />;

    case "division":
      return <DivisionDots total={a} divisor={b} color={op.dotColorA} />;

    default:
      return null;
  }
}
