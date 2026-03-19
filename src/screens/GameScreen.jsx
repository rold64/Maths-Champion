import { useState, useEffect, useRef } from "react";
import { OPERATIONS }           from "../data/operations.js";
import { LEVELS }               from "../data/levels.js";
import { generateProblem, getSymbol, formatTime, timeLabel } from "../utils/generateProblem.js";
import { saveResult, getRecord } from "../utils/storage.js";
import { getSuggestion, suggestionMessage } from "../utils/adaptive.js";
import SoundEngine               from "../sounds/SoundEngine.js";
import StarBurst                 from "../components/StarBurst.jsx";
import NumberPad                 from "../components/NumberPad.jsx";
import ProgressBar               from "../components/ProgressBar.jsx";
import VisualHelper              from "../components/VisualHelper.jsx";

const TOTAL_ROUNDS = 10;

// Returns a human-readable question string for non-standard modes
function getQuestionText(opId, problem) {
  if (opId === "numbonds") {
    return problem.missing === "partA"
      ? `? + ${problem.partB} = ${problem.total}`
      : `${problem.partA} + ? = ${problem.total}`;
  }
  if (opId === "placevalue") {
    if (problem.qType === "value") {
      return `What is the VALUE of the ${problem.askCol.toUpperCase()} digit in ${problem.number}?`;
    }
    return `What is the ${problem.askCol.toUpperCase()} digit of ${problem.number}?`;
  }
  if (opId === "fractions") {
    if (problem.fracType === "equivalent") {
      return `${problem.numerator}/${problem.denominator} = ?/${problem.equivDenominator}`;
    }
    if (problem.qType === "total") return "How many equal parts are there altogether?";
    if (problem.qType === "value") return "How many parts are shaded?";
    return "How many parts are shaded?";
  }
  if (opId === "time") {
    if (problem.askType === "readtime") return "What time does the clock show?";
    if (problem.askType === "hour")     return "What is the HOUR shown on the clock?";
    return "How many MINUTES does the clock show?";
  }
  return null;
}

function getHelpMessage(opId, problem) {
  const ans = problem.answer;

  if (opId === "addsub" && problem.family) {
    const { x, y, total } = problem.family;
    const msgs = [
      `The answer is ${ans}. Because ${x}+${y}=${total}, we know ${total}−${y}=${x}!`,
      `${problem.a} ${problem.symbol} ${problem.b} = ${ans}. Family: ${x}, ${y}, ${total}!`,
      `Almost! Answer was ${ans}. Remember: ${x}+${y}=${total} ↔ ${total}−${x}=${y}`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (opId === "muldiv" && problem.family) {
    const { x, y, total } = problem.family;
    const msgs = [
      `The answer is ${ans}. Because ${x}×${y}=${total}, we know ${total}÷${y}=${x}!`,
      `Almost! Answer was ${ans}. Remember: ${x}×${y}=${total} ↔ ${total}÷${x}=${y}`,
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (opId === "numbonds") {
    return `The missing part is ${ans}. ${problem.partA} + ${problem.partB} = ${problem.total}!`;
  }
  if (opId === "placevalue") {
    return problem.qType === "value"
      ? `The value of the ${problem.askCol} digit is ${ans}. (digit ${problem.digit} × ${{"ones":1,"tens":10,"hundreds":100,"thousands":1000,"tenths":"0.1","hundredths":"0.01"}[problem.askCol]} = ${ans})`
      : `The ${problem.askCol} digit of ${problem.number} is ${ans}.`;
  }
  if (opId === "fractions") {
    if (problem.fracType === "equivalent") {
      return `${problem.numerator}/${problem.denominator} = ${problem.equivNumerator}/${problem.equivDenominator}. The answer is ${ans}!`;
    }
    return `The answer is ${ans}. Look at the fraction bar — ${problem.numerator} out of ${problem.denominator} parts.`;
  }
  if (opId === "time") {
    const timeStr = timeLabel(problem.hours, problem.minutes);
    if (problem.askType === "readtime") return `The time is ${ans} (${timeStr}). Type H:MM!`;
    return problem.askType === "hour"
      ? `The hour is ${ans}. The clock shows ${timeStr}.`
      : `The minutes are ${ans}. The clock shows ${timeStr}.`;
  }
  const sym = getSymbol(opId, problem);
  const msgs = [
    `The answer is ${ans}. You'll get the next one!`,
    `Almost! ${problem.a} ${sym} ${problem.b} = ${ans}`,
    `Keep going! The answer was ${ans}`,
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function getCorrectMessage(opId, problem) {
  const encouragements = ["Amazing! 🎉","You're a star! ⭐","Fantastic! 🌟","Super brain! 🧠","Wow! 🎊","Nailed it! 💪","Brilliant! 🌈"];
  const base = encouragements[Math.floor(Math.random() * encouragements.length)];

  if (opId === "addsub" && problem.family) {
    const { x, y, total } = problem.family;
    const bonus = [...encouragements, `Yes! ${x}+${y}=${total} and ${total}−${x}=${y}! 🔗`, `You see the pattern! ${x}, ${y}, ${total} are a family! 👨‍👩‍👧`];
    return bonus[Math.floor(Math.random() * bonus.length)];
  }
  if (opId === "muldiv" && problem.family) {
    const { x, y, total } = problem.family;
    const bonus = [...encouragements, `Yes! ${x}×${y}=${total} and ${total}÷${x}=${y}! 🔗`];
    return bonus[Math.floor(Math.random() * bonus.length)];
  }
  if (opId === "fractions" && problem.fracType === "equivalent") {
    return `${base} ${problem.numerator}/${problem.denominator} = ${problem.equivNumerator}/${problem.equivDenominator}! 🍕`;
  }
  return base;
}

export default function GameScreen({ opId, levelIdx, onHome, onLevelSelect }) {
  const op       = OPERATIONS.find(o => o.id === opId);
  const lvl      = LEVELS[opId][levelIdx];
  const lvlCount = LEVELS[opId].length;

  const [problem,    setProblem]    = useState(() => generateProblem(opId, lvl));
  const [userInput,  setUserInput]  = useState("");
  const [feedback,   setFeedback]   = useState(null);
  const [score,      setScore]      = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round,      setRound]      = useState(0);
  const [results,    setResults]    = useState([]);
  const [bursts,     setBursts]     = useState([]);
  const [showVisual, setShowVisual] = useState(true);
  const [done,       setDone]       = useState(false);
  const [suggestion, setSuggestion] = useState(null);

  const burstId      = useRef(0);
  const feedbackMsg  = useRef("");
  const prevProblem  = useRef(null);

  const isCustomDisplay = ["numbonds","placevalue","fractions","time"].includes(opId);
  const sym = getSymbol(opId, problem);

  function nextProblem() {
    const next = generateProblem(opId, lvl, prevProblem.current);
    prevProblem.current = next;
    return next;
  }

  function addBurst() {
    const id  = burstId.current++;
    const el  = document.querySelector("[data-answer-box]");
    const rect = el?.getBoundingClientRect?.();
    const x   = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y   = rect ? rect.top : window.innerHeight / 2;
    setBursts(prev => [...prev, { id, x, y }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 700);
  }

  const isReadTime = opId === "time" && problem.askType === "readtime";

  function handlePad(key) {
    if (feedback) return;
    if (key === "backspace") {
      setUserInput(prev => prev.slice(0, -1));
    } else if (key === "submit") {
      checkAnswer();
    } else if (key === ":") {
      if (isReadTime && !userInput.includes(":") && userInput.length > 0 && userInput.length <= 2) {
        setUserInput(prev => prev + ":");
      }
    } else if (userInput.length < (isReadTime ? 5 : 4)) {
      setUserInput(prev => prev + key);
    }
  }

  function checkAnswer() {
    if (!userInput || feedback) return;
    const correct = isReadTime
      ? userInput === problem.answer
      : parseInt(userInput) === problem.answer;

    if (correct) {
      addBurst();
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        if (next >= 3 && next % 3 === 0) SoundEngine.streak();
        else SoundEngine.correct();
        return next;
      });
      feedbackMsg.current = getCorrectMessage(opId, problem);
    } else {
      SoundEngine.wrong();
      setStreak(0);
      feedbackMsg.current = getHelpMessage(opId, problem);
    }

    setResults(prev => [...prev, {
      problem, correct,
      userAnswer: isReadTime ? userInput : parseInt(userInput),
      display: isCustomDisplay ? getQuestionText(opId, problem) : null,
      sym,
    }]);
    setFeedback(correct ? "correct" : "wrong");

    setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        setDone(true);
      } else {
        setRound(r => r + 1);
        prevProblem.current = problem;
        setProblem(nextProblem());
        setUserInput("");
        setFeedback(null);
      }
    }, correct ? 1200 : 2800);
  }

  useEffect(() => {
    if (done) {
      SoundEngine.victory();
      const saved = saveResult(opId, levelIdx, score, TOTAL_ROUNDS);
      const sugg  = getSuggestion(opId, levelIdx, saved.recentAccuracy, lvlCount);
      setSuggestion(sugg);
    }
  }, [done]);

  // ── Results screen ─────────────────────────────────────
  if (done) {
    const levels = LEVELS[opId];
    const suggMsg = suggestionMessage(suggestion, levelIdx, levels);
    return (
      <div style={{
        minHeight:"100vh", background:op.bg, fontFamily:"'Fredoka', sans-serif",
        display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 16px",
      }}>
        <div style={{ textAlign:"center", maxWidth:420, width:"100%", animation:"fadeUp 0.5s ease" }}>
          <div style={{ fontSize:56, marginBottom:8 }}>
            {score >= 9 ? "🏆" : score >= 7 ? "🌟" : score >= 5 ? "👍" : "💪"}
          </div>
          <h2 style={{ fontSize:28, fontWeight:700, color:"#1e293b", margin:"0 0 4px" }}>
            {score >= 9 ? "Incredible!" : score >= 7 ? "Great job!" : score >= 5 ? "Good work!" : "Keep practising!"}
          </h2>
          <p style={{ color:"#64748b", margin:"0 0 14px", fontWeight:500, fontSize:16 }}>
            You got <strong style={{ color:op.color }}>{score}</strong> out of <strong>{TOTAL_ROUNDS}</strong> correct!
          </p>

          {/* Stars */}
          <div style={{ display:"flex", justifyContent:"center", gap:4, marginBottom:14 }}>
            {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
              <div key={i} style={{ fontSize:18, opacity: i < score ? 1 : 0.2, animation: i < score ? `popIn 0.3s ease ${i*0.06}s both` : "none" }}>⭐</div>
            ))}
          </div>

          {bestStreak > 1 && (
            <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:14, padding:"7px 14px", display:"inline-block", marginBottom:12 }}>
              <span style={{ fontSize:14, color:"#64748b" }}>Best streak: </span>
              <span style={{ fontSize:18, fontWeight:700, color:"#f59e0b" }}>🔥 {bestStreak}</span>
            </div>
          )}

          {/* Adaptive suggestion */}
          {suggMsg && (
            <div style={{
              background:"rgba(255,255,255,0.8)", borderRadius:14, padding:"10px 16px",
              marginBottom:12, border:`2px solid ${op.color}33`, fontSize:14,
              color:"#1e293b", fontWeight:600,
            }}>
              {suggMsg}
            </div>
          )}

          {/* Results list */}
          <div style={{
            background:"rgba(255,255,255,0.7)", borderRadius:20, padding:14,
            marginBottom:18, maxHeight:220, overflowY:"auto",
          }}>
            {results.map((r, i) => (
              <div key={i} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"7px 12px", borderRadius:10,
                background: r.correct ? "#f0fdf4" : "#fef2f2",
                marginBottom: i < results.length - 1 ? 5 : 0,
                fontSize:14, fontWeight:600,
              }}>
                <span style={{ color:"#334155", fontSize:13 }}>
                  {r.display
                    ? r.display
                    : `${r.problem.a} ${r.sym} ${r.problem.b}`}
                  {" = "}{r.userAnswer}
                </span>
                <span>
                  {r.correct
                    ? <span style={{ color:"#16a34a" }}>✓</span>
                    : <span style={{ color:"#dc2626" }}>✗ ({r.problem.answer})</span>}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
            <button
              onClick={() => { SoundEngine.selectLevel(); setDone(false); setScore(0); setStreak(0); setBestStreak(0); setRound(0); setResults([]); setFeedback(null); setUserInput(""); prevProblem.current = null; setProblem(generateProblem(opId, lvl)); }}
              style={{ padding:"13px 24px", borderRadius:16, border:"none", background:op.gradient, color:"white", fontSize:16, fontWeight:700, fontFamily:"'Fredoka', sans-serif", cursor:"pointer", boxShadow:`0 4px 16px ${op.color}44` }}>
              Play Again
            </button>
            <button
              onClick={() => { SoundEngine.navigate(); onLevelSelect(); }}
              style={{ padding:"13px 24px", borderRadius:16, border:"2px solid #e2e8f0", background:"rgba(255,255,255,0.8)", color:"#64748b", fontSize:16, fontWeight:700, fontFamily:"'Fredoka', sans-serif", cursor:"pointer" }}>
              Levels
            </button>
            <button
              onClick={() => { SoundEngine.navigate(); onHome(); }}
              style={{ padding:"13px 24px", borderRadius:16, border:"2px solid #e2e8f0", background:"rgba(255,255,255,0.8)", color:"#64748b", fontSize:16, fontWeight:700, fontFamily:"'Fredoka', sans-serif", cursor:"pointer" }}>
              Home
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes popIn  { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
        `}</style>
      </div>
    );
  }

  // ── Question text for custom display modes ─────────────
  const questionText = getQuestionText(opId, problem);

  return (
    <div style={{
      minHeight:"100vh", background:op.bg, fontFamily:"'Fredoka', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"20px 16px", position:"relative", overflow:"hidden",
    }}>
      {bursts.map(b => <StarBurst key={b.id} x={b.x} y={b.y} />)}

      <div style={{ textAlign:"center", maxWidth:420, width:"100%", animation:"fadeUp 0.4s ease" }}>
        {/* Top bar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <button onClick={() => { SoundEngine.navigate(); onLevelSelect(); }} style={{
            background:"rgba(255,255,255,0.7)", border:"none", borderRadius:12,
            padding:"8px 14px", fontFamily:"'Fredoka', sans-serif", fontWeight:600,
            color:"#64748b", cursor:"pointer", fontSize:14,
          }}>← Back</button>

          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:18 }}>{lvl.emoji}</span>
            <span style={{ fontWeight:700, color:op.color, fontSize:15 }}>{op.name}</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            {streak >= 3 && <span style={{ fontSize:15 }}>🔥</span>}
            <span style={{ fontWeight:600, color:"#f59e0b", fontSize:15 }}>{score}/{round + 1}</span>
          </div>
        </div>

        <ProgressBar current={round + 1} total={TOTAL_ROUNDS} color={op.color} />
        <div style={{ fontSize:12, color:"#94a3b8", marginTop:3, marginBottom:12, fontWeight:500 }}>
          Question {round + 1} of {TOTAL_ROUNDS}
        </div>

        {/* Toggle visual button */}
        <button onClick={() => setShowVisual(v => !v)} style={{
          background: showVisual ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
          border:"2px solid #e2e8f0", borderRadius:10, padding:"5px 14px",
          fontFamily:"'Fredoka', sans-serif", fontSize:13, fontWeight:500,
          color:"#64748b", cursor:"pointer", marginBottom:12, transition:"all 0.2s",
        }}>
          {showVisual ? "Hide" : "Show"} {op.isFamily ? "fact family" : "visual helper"}
        </button>

        {/* Question card */}
        <div style={{
          background:"rgba(255,255,255,0.8)", backdropFilter:"blur(8px)",
          borderRadius:24, padding:"20px 18px", marginBottom:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.06)",
          border: feedback === "correct" ? "3px solid #22c55e" : feedback === "wrong" ? "3px solid #ef4444" : "3px solid transparent",
          transition:"border-color 0.3s",
        }}>
          {showVisual && <VisualHelper opId={opId} problem={problem} op={op} />}

          {/* Equation or custom question */}
          {isCustomDisplay ? (
            <div style={{ marginBottom:12 }}>
              <div style={{
                fontFamily:"'Fredoka', sans-serif", fontSize:18, fontWeight:600,
                color:"#1e293b", marginBottom:12, lineHeight:1.4, padding:"0 4px",
              }}>
                {questionText}
              </div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                <span style={{ fontFamily:"'Fredoka', sans-serif", fontSize:22, color:"#64748b", fontWeight:500 }}>Answer:</span>
                <AnswerBox feedback={feedback} value={userInput} />
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
              <span style={{ fontSize:44, fontWeight:700, color:op.dotColorA }}>{problem.a}</span>
              <span style={{ fontSize:36, fontWeight:700, color:"#94a3b8" }}>{sym}</span>
              <span style={{ fontSize:44, fontWeight:700, color:op.dotColorB || op.color }}>{problem.b}</span>
              <span style={{ fontSize:36, fontWeight:700, color:"#94a3b8" }}>=</span>
              <AnswerBox feedback={feedback} value={userInput} />
            </div>
          )}

          {feedback && (
            <div style={{
              marginTop:12, fontSize: feedback === "wrong" ? 15 : 17, fontWeight:600,
              color: feedback === "correct" ? "#16a34a" : "#dc2626",
              animation:"fadeUp 0.3s ease", lineHeight:1.4, padding:"0 4px",
            }}>
              {feedbackMsg.current}
            </div>
          )}
        </div>

        <NumberPad onPress={handlePad} disabled={!!feedback} showColon={isReadTime} />
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink  { 50% { opacity:0; } }
        @keyframes popIn  { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
      `}</style>
    </div>
  );
}

function AnswerBox({ feedback, value }) {
  const isWide = value.includes(":");
  return (
    <div data-answer-box style={{
      minWidth: isWide ? 110 : 76, height:60, borderRadius:16,
      background: feedback === "correct" ? "#dcfce7" : feedback === "wrong" ? "#fee2e2" : "#f1f5f9",
      border: `3px dashed ${feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#cbd5e1"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize: isWide ? 30 : 38, fontWeight:700,
      color: feedback === "correct" ? "#16a34a" : feedback === "wrong" ? "#dc2626" : "#334155",
      transition:"all 0.3s", letterSpacing: isWide ? 2 : 0,
    }}>
      {value || <span style={{ width:3, height:32, background:"#94a3b8", borderRadius:2, animation:"blink 1s step-end infinite" }} />}
    </div>
  );
}
