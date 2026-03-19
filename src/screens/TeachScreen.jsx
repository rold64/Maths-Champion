import { useState } from "react";
import { OPERATIONS }          from "../data/operations.js";
import SoundEngine             from "../sounds/SoundEngine.js";
import DotGroup                from "../components/visuals/DotGroup.jsx";
import MultiplicationDots      from "../components/visuals/MultiplicationDots.jsx";
import DivisionDots            from "../components/visuals/DivisionDots.jsx";
import FactFamilyTriangle      from "../components/visuals/FactFamilyTriangle.jsx";
import NumberLine              from "../components/visuals/NumberLine.jsx";
import FractionBar             from "../components/visuals/FractionBar.jsx";
import NumberBond              from "../components/visuals/NumberBond.jsx";
import PlaceValueDisplay       from "../components/visuals/PlaceValueDisplay.jsx";
import ClockFace               from "../components/visuals/ClockFace.jsx";

/* ─────────────────── Teaching content ─────────────────── */

const TEACH_CONTENT = {

  addition: [
    {
      title: "What is Addition?",
      text: "Addition means putting two groups of things together to make a bigger group. We use the + sign.",
      visual: () => (
        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-end", gap:16, flexWrap:"wrap" }}>
          <DotGroup count={3} color="#6366f1" label={3} />
          <span style={{ fontSize:30, fontWeight:700, color:"#94a3b8", alignSelf:"center" }}>+</span>
          <DotGroup count={4} color="#ec4899" label={4} />
          <span style={{ fontSize:30, fontWeight:700, color:"#94a3b8", alignSelf:"center" }}>=</span>
          <DotGroup count={7} color="#6366f1" label={7} />
        </div>
      ),
    },
    {
      title: "Count On!",
      text: "Start with the bigger number and count on. For 5 + 3, start at 5 and count on 3 steps: 6, 7, 8!",
      visual: () => <NumberLine a={5} b={3} operation="addition" color="#6366f1" />,
    },
    {
      title: "Adding with a Number Line",
      text: "The number line shows your journey. The arrow jumps forward by the number you are adding. Watch how 8 + 4 works!",
      visual: () => <NumberLine a={8} b={4} operation="addition" color="#6366f1" />,
    },
    {
      title: "Column Addition — No Carrying",
      text: "Write numbers in columns. Always add the ONES first (right column), then the TENS (left column). 23 + 14 = ?",
      visual: () => <ColumnAddition a={23} b={14} carry={false} />,
    },
    {
      title: "Column Addition — With Carrying!",
      text: "When the ones add up to 10 or more, write the units digit and CARRY the tens digit to the next column.",
      visual: () => <ColumnAddition a={28} b={35} carry={true} />,
    },
    {
      title: "Now you're ready!",
      text: "You know how to add using dots, number lines, and columns. Remember: always start from the right when using columns. Let's practise!",
      visual: () => (
        <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>
      ),
    },
  ],

  subtraction: [
    {
      title: "What is Subtraction?",
      text: "Subtraction means taking things away from a group. We use the − sign. If we have 8 apples and eat 3, we have 5 left!",
      visual: () => (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, color:"#94a3b8" }}>Start with 8, take away 3</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", maxWidth:180, background:"rgba(255,255,255,0.6)", borderRadius:14, padding:"10px 14px" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width:18, height:18, borderRadius:"50%", background: i < 5 ? "#0ea5e9" : "#f43f5e", opacity: i < 5 ? 1 : 0.3 }} />
            ))}
          </div>
          <div style={{ fontSize:12, color:"#94a3b8" }}><span style={{ color:"#0ea5e9" }}>● keep (5)</span> &nbsp; <span style={{ color:"#f43f5e", opacity:0.5 }}>● remove (3)</span></div>
        </div>
      ),
    },
    {
      title: "Count Back!",
      text: "Start at the bigger number and count BACK. For 9 − 4, start at 9 and count back 4 steps: 8, 7, 6, 5!",
      visual: () => <NumberLine a={9} b={4} operation="subtraction" color="#0ea5e9" />,
    },
    {
      title: "Column Subtraction — No Borrowing",
      text: "Write the bigger number on top. Subtract the ones, then the tens. Always work from right to left!",
      visual: () => <ColumnSubtraction a={57} b={23} borrow={false} />,
    },
    {
      title: "Column Subtraction — Borrowing!",
      text: "If the top digit is smaller than the bottom, BORROW 10 from the tens column. The top tens digit goes down by 1, but the ones get +10!",
      visual: () => <ColumnSubtraction a={52} b={37} borrow={true} />,
    },
    {
      title: "Subtraction and Addition are Linked!",
      text: "You can always CHECK a subtraction by adding back. If 52 − 37 = 15, then 15 + 37 = 52! They are opposites.",
      visual: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
          <NumberLine a={52} b={37} operation="subtraction" color="#0ea5e9" />
        </div>
      ),
    },
    {
      title: "Ready to subtract!",
      text: "You can take away using dots, number lines, and columns. Remember: borrow when you need to! Let's practise!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  multiplication: [
    {
      title: "What is Multiplication?",
      text: "Multiplication means adding equal groups together quickly. 3 × 4 means '3 groups of 4' — it's a shortcut for 4 + 4 + 4!",
      visual: () => <MultiplicationDots a={3} b={4} color="#f59e0b" />,
    },
    {
      title: "Repeated Addition",
      text: "3 × 5 is the same as 5 + 5 + 5. Count the dots: each row has 5, and there are 3 rows!",
      visual: () => <MultiplicationDots a={3} b={5} color="#f59e0b" />,
    },
    {
      title: "The Order Doesn't Matter!",
      text: "3 × 4 = 4 × 3 = 12. This is called the commutative property — you can swap the numbers around!",
      visual: () => (
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>3 × 4</div>
            <MultiplicationDots a={3} b={4} color="#f59e0b" />
          </div>
          <div style={{ display:"flex", alignItems:"center", fontSize:24, fontWeight:700, color:"#94a3b8" }}>=</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:12, color:"#94a3b8", marginBottom:4 }}>4 × 3</div>
            <MultiplicationDots a={4} b={3} color="#8b5cf6" />
          </div>
        </div>
      ),
    },
    {
      title: "Times Table Tips",
      text: "× 2 = double the number. × 5 = always ends in 0 or 5. × 10 = just add a zero! × 1 = always the same number.",
      visual: () => <TimesTableTips />,
    },
    {
      title: "Let's multiply!",
      text: "You know that multiplication is quick adding of equal groups. Use your times table knowledge — you've got this!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  division: [
    {
      title: "What is Division?",
      text: "Division means sharing things equally into groups. 12 ÷ 3 means 'share 12 into 3 equal groups'. How many in each group?",
      visual: () => <DivisionDots total={12} divisor={3} color="#10b981" />,
    },
    {
      title: "Sharing into Groups",
      text: "Here 20 ÷ 4 = 5. We put 20 dots into groups of 4. Count the groups — there are 5! That's the answer.",
      visual: () => <DivisionDots total={20} divisor={4} color="#10b981" />,
    },
    {
      title: "Division is the Opposite of Multiplication!",
      text: "If 3 × 4 = 12, then 12 ÷ 3 = 4 and 12 ÷ 4 = 3. Knowing your times tables makes division easy!",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:3, y:4, total:12 }}
          opType="muldiv"
          colorA="#f59e0b"
          colorB="#10b981"
        />
      ),
    },
    {
      title: "No Remainders Here!",
      text: "In this game, divisions always divide evenly — no leftovers! Think of it as: 'which number × the divisor = the total?'",
      visual: () => <DivisionDots total={15} divisor={5} color="#10b981" />,
    },
    {
      title: "Ready to divide!",
      text: "Use your multiplication knowledge backwards. If you know 6 × 3 = 18, then 18 ÷ 6 = 3. Let's go!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  addsub: [
    {
      title: "What is a Fact Family?",
      text: "A fact family is three numbers that work together. For the numbers 3, 5, and 8 — you can make FOUR equations!",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:3, y:5, total:8 }}
          opType="addsub"
          colorA="#6366f1"
          colorB="#0ea5e9"
        />
      ),
    },
    {
      title: "The Triangle Shows the Family",
      text: "The TOTAL is always at the top. The two PARTS are at the bottom. The triangle shows how they all connect!",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:4, y:6, total:10 }}
          opType="addsub"
          colorA="#6366f1"
          colorB="#0ea5e9"
        />
      ),
    },
    {
      title: "Subtraction Undoes Addition",
      text: "If 4 + 6 = 10, then 10 − 6 = 4. Subtraction is the REVERSE of addition. They always come in pairs!",
      visual: () => (
        <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
          <NumberLine a={4} b={6} operation="addition" color="#6366f1" />
          <NumberLine a={10} b={6} operation="subtraction" color="#0ea5e9" />
        </div>
      ),
    },
    {
      title: "Spot the Pattern!",
      text: "Any time you see one equation in the family, you know all four! This makes maths MUCH faster.",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:7, y:8, total:15 }}
          opType="addsub"
          colorA="#6366f1"
          colorB="#0ea5e9"
        />
      ),
    },
    {
      title: "You're a Fact Family Expert!",
      text: "Now practise finding all four equations from just three numbers. Your brain will start to see the patterns automatically!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  muldiv: [
    {
      title: "Multiplication & Division Fact Families",
      text: "Just like + and −, multiplication and division are opposites. Three numbers make a family of FOUR equations!",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:3, y:4, total:12 }}
          opType="muldiv"
          colorA="#f59e0b"
          colorB="#10b981"
        />
      ),
    },
    {
      title: "The Total Goes at the Top",
      text: "The PRODUCT (the answer to multiplication) always goes at the top. The two factors sit at the bottom.",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:5, y:6, total:30 }}
          opType="muldiv"
          colorA="#f59e0b"
          colorB="#10b981"
        />
      ),
    },
    {
      title: "Division Undoes Multiplication",
      text: "If 5 × 6 = 30, then 30 ÷ 5 = 6 and 30 ÷ 6 = 5. Division reverses multiplication!",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:5, y:6, total:30 }}
          opType="muldiv"
          colorA="#f59e0b"
          colorB="#10b981"
        />
      ),
    },
    {
      title: "Use Multiplication to Help Division!",
      text: "Don't know 56 ÷ 7? Ask yourself: '7 × what = 56?' The answer is 8! This is why times tables are so powerful.",
      visual: () => (
        <FactFamilyTriangle
          family={{ x:7, y:8, total:56 }}
          opType="muldiv"
          colorA="#f59e0b"
          colorB="#10b981"
        />
      ),
    },
    {
      title: "You know your fact families!",
      text: "Knowing one fact gives you three more for free. Practise finding the family from a single equation!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  numbonds: [
    {
      title: "What are Number Bonds?",
      text: "Number bonds show how a number can be split into two parts. 10 can be split into 3 and 7, or 4 and 6, or 5 and 5!",
      visual: () => <NumberBond total={10} partA={3} partB={7} missing={null} colorA="#06b6d4" colorB="#8b5cf6" />,
    },
    {
      title: "Find the Missing Part",
      text: "If the whole is 10 and one part is 4, what is the other part? Count on from 4 to 10: 5, 6, 7, 8, 9, 10 — that's 6!",
      visual: () => <NumberBond total={10} partA={4} partB={6} missing="partB" colorA="#06b6d4" colorB="#8b5cf6" />,
    },
    {
      title: "Bonds to 10",
      text: "These are the most important! 1+9, 2+8, 3+7, 4+6, 5+5, 6+4, 7+3, 8+2, 9+1. Can you see the pattern?",
      visual: () => <BondsTo10 />,
    },
    {
      title: "Number Bonds Help with Addition!",
      text: "If you know that 7 + 3 = 10, and you need 7 + 5, you can think: 7 + 3 = 10, then 10 + 2 more = 12!",
      visual: () => <NumberBond total={12} partA={7} partB={5} missing={null} colorA="#06b6d4" colorB="#8b5cf6" />,
    },
    {
      title: "You know your bonds!",
      text: "Number bonds are the building blocks of all maths. The faster you can recall them, the easier everything else becomes!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  placevalue: [
    {
      title: "Every Digit has a Place",
      text: "In the number 156, each digit has a different value depending on its PLACE. The 1 means 100, the 5 means 50, and the 6 means 6.",
      visual: () => <PlaceValueDisplay number={156} askCol="hundreds" qType="value" color="#7c3aed" />,
    },
    {
      title: "Ones, Tens, Hundreds",
      text: "Reading from right to left: ONES (units), TENS (groups of 10), HUNDREDS (groups of 100). The column tells you the value!",
      visual: () => <PlaceValueDisplay number={352} askCol="tens" qType="digit" color="#7c3aed" />,
    },
    {
      title: "The Digit vs The Value",
      text: "In 374, the digit in the tens column is 7 — but its VALUE is 70 (7 × 10). A digit's value depends on where it sits!",
      visual: () => <PlaceValueDisplay number={374} askCol="tens" qType="value" color="#7c3aed" />,
    },
    {
      title: "Thousands!",
      text: "Bigger numbers have a THOUSANDS column. In 2,483: 2 thousands, 4 hundreds, 8 tens, 3 ones. That's 2000 + 400 + 80 + 3!",
      visual: () => <PlaceValueDisplay number={2483} askCol="thousands" qType="digit" color="#7c3aed" />,
    },
    {
      title: "Decimal Numbers",
      text: "After the decimal point, we have TENTHS and HUNDREDTHS. In 3.75: 3 ones, 7 tenths (0.7), 5 hundredths (0.05).",
      visual: () => <PlaceValueDisplay number={3.75} askCol="tenths" qType="digit" color="#7c3aed" />,
    },
    {
      title: "You understand place value!",
      text: "The value of any digit depends on its position. This is the foundation of our whole number system. Let's practise!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  fractions: [
    {
      title: "What is a Fraction?",
      text: "A fraction shows part of a whole that has been split into EQUAL parts. The bottom number (denominator) tells you how many parts. The top number (numerator) tells you how many you have.",
      visual: () => <FractionBar numerator={1} denominator={2} color="#e11d48" />,
    },
    {
      title: "Halves, Quarters, and Thirds",
      text: "½ means 1 out of 2 equal parts. ¼ means 1 out of 4. ⅓ means 1 out of 3. The more parts, the smaller each piece!",
      visual: () => (
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <FractionBar numerator={1} denominator={2} color="#e11d48" showLabel={false} />
          <FractionBar numerator={1} denominator={4} color="#f59e0b" showLabel={false} />
          <FractionBar numerator={1} denominator={3} color="#10b981" showLabel={false} />
        </div>
      ),
    },
    {
      title: "Non-Unit Fractions",
      text: "¾ means 3 out of 4 equal parts — three quarters! ⅔ means 2 out of 3 parts — two thirds. The numerator tells you how many shaded parts.",
      visual: () => (
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <FractionBar numerator={3} denominator={4} color="#e11d48" showLabel={true} />
          <FractionBar numerator={2} denominator={3} color="#8b5cf6" showLabel={true} />
        </div>
      ),
    },
    {
      title: "Equivalent Fractions",
      text: "½ = 2/4 = 4/8 — these all show the same amount! Multiply BOTH numbers by the same amount to find an equivalent fraction.",
      visual: () => (
        <div style={{ display:"flex", gap:10, justifyContent:"center", alignItems:"center", flexWrap:"wrap" }}>
          <FractionBar numerator={1} denominator={2} color="#e11d48" showLabel={false} />
          <span style={{ fontSize:22, fontWeight:700, color:"#94a3b8" }}>=</span>
          <FractionBar numerator={2} denominator={4} color="#f59e0b" showLabel={false} />
          <span style={{ fontSize:22, fontWeight:700, color:"#94a3b8" }}>=</span>
          <FractionBar numerator={4} denominator={8} color="#10b981" showLabel={false} />
        </div>
      ),
    },
    {
      title: "Fractions Greater Than 1",
      text: "When the top number is bigger than the bottom, we have more than a whole! 5/4 = 1 whole and ¼ more = 1¼ (one and a quarter).",
      visual: () => (
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          <FractionBar numerator={4} denominator={4} color="#e11d48" showLabel={true} />
          <span style={{ fontSize:22, fontWeight:700, color:"#94a3b8", alignSelf:"center" }}>+</span>
          <FractionBar numerator={1} denominator={4} color="#e11d48" showLabel={true} />
        </div>
      ),
    },
    {
      title: "You understand fractions!",
      text: "Remember: denominator = total parts, numerator = your parts. Bigger denominator = smaller pieces! Let's practise!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],

  time: [
    {
      title: "The Clock Has Two Hands",
      text: "The SHORT hand is the HOUR hand — it moves slowly around the clock once every 12 hours. The LONG hand is the MINUTE hand — it goes all the way round once every hour.",
      visual: () => (
        <div style={{ display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={3} minutes={0} color="#0284c7" size={140} showLabel={false} highlightHand="hour" />
            <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, color:"#e11d48", fontWeight:700, marginTop:4 }}>Short = HOUR</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={3} minutes={0} color="#0284c7" size={140} showLabel={false} highlightHand="minute" />
            <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, color:"#0284c7", fontWeight:700, marginTop:4 }}>Long = MINUTE</div>
          </div>
        </div>
      ),
    },
    {
      title: "O'Clock",
      text: "When the minute hand (long) points to 12, it is exactly ON THE HOUR — we say 'o'clock'. The hour hand tells you which hour it is.",
      visual: () => (
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={3} minutes={0} color="#0284c7" size={130} showLabel={true} />
          </div>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={7} minutes={0} color="#0284c7" size={130} showLabel={true} />
          </div>
        </div>
      ),
    },
    {
      title: "Half Past",
      text: "When the minute hand points to 6 (halfway round), it is HALF PAST. The hour hand sits halfway between two numbers.",
      visual: () => (
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <ClockFace hours={3} minutes={30} color="#0284c7" size={130} showLabel={true} />
          <ClockFace hours={8} minutes={30} color="#0284c7" size={130} showLabel={true} />
        </div>
      ),
    },
    {
      title: "Quarter Past and Quarter To",
      text: "Quarter past = minute hand on 3 (15 minutes). Quarter to = minute hand on 9 (45 minutes, or 15 minutes BEFORE the next hour).",
      visual: () => (
        <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap" }}>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={4} minutes={15} color="#0284c7" size={130} showLabel={true} />
          </div>
          <div style={{ textAlign:"center" }}>
            <ClockFace hours={4} minutes={45} color="#0284c7" size={130} showLabel={true} />
          </div>
        </div>
      ),
    },
    {
      title: "Counting in 5s — Minutes",
      text: "The minute hand takes 5 minutes to move from one number to the next. Count in 5s: 5, 10, 15, 20, 25, 30... When it reaches 12 again, 60 minutes have passed — that's 1 hour!",
      visual: () => <MinuteCountingVisual />,
    },
    {
      title: "Reading Any Time",
      text: "1. Look at the SHORT hand for the hour (the number it has just passed). 2. Count the minutes on the LONG hand in 5s, then add the extra minutes. Put it together: hours:minutes!",
      visual: () => (
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <ClockFace hours={2} minutes={17} color="#0284c7" size={130} showLabel={true} />
          <ClockFace hours={10} minutes={43} color="#0284c7" size={130} showLabel={true} />
        </div>
      ),
    },
    {
      title: "You can tell the time!",
      text: "Short hand = hour, long hand = minutes. Count in 5s from 12 for the minutes, then add extras. You'll be an expert in no time!",
      visual: () => <div style={{ textAlign:"center", fontSize:48 }}>🎉</div>,
    },
  ],
};

/* ─────────── Helper visual sub-components ─────────── */

function ColumnAddition({ a, b, carry }) {
  const ans      = a + b;
  const maxLen   = Math.max(String(a).length, String(b).length, String(ans).length);
  const pad      = (n) => String(n).padStart(maxLen, " ").split("");
  const aDigits  = pad(a);
  const bDigits  = pad(b);
  const ansDigits = pad(ans);
  const onesSum  = (a % 10) + (b % 10);
  const carryVal = carry ? Math.floor(onesSum / 10) : 0;

  // carry indicator sits above the tens column (index maxLen-2)
  const carryDigits = Array(maxLen).fill("");
  if (carry) carryDigits[maxLen - 2] = String(carryVal);

  const OP_W = 36;
  const cellStyle = (highlight, faded) => ({
    width: 40, height: 44, display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Fredoka', sans-serif", fontSize:24, fontWeight:700,
    color: highlight ? "#6366f1" : "#1e293b",
    background: highlight ? "#6366f122" : "transparent",
    borderRadius: 8,
    opacity: faded ? 0 : 1,
  });
  const row = (digits, opSymbol, opColor, highlight) => (
    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
      <div style={{ width:OP_W, height:44, display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Fredoka', sans-serif", fontSize:22, fontWeight:700, color: opColor || "transparent" }}>
        {opSymbol || ""}
      </div>
      {digits.map((d, i) => <div key={i} style={cellStyle(highlight, d === " ")}>{d === " " ? "" : d}</div>)}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:16, padding:"14px 20px", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        {carry && (
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <div style={{ width:OP_W }} />
            {carryDigits.map((d, i) => (
              <div key={i} style={{ width:40, height:24, display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'Fredoka', sans-serif", fontSize:16, fontWeight:700, color:"#e11d48" }}>
                {d}
              </div>
            ))}
          </div>
        )}
        {row(aDigits, null, null, false)}
        {row(bDigits, "+", "#6366f1", false)}
        <div style={{ width:"100%", height:2.5, background:"#6366f1", borderRadius:2, margin:"4px 0" }} />
        {row(ansDigits, null, null, true)}
      </div>
      {carry && (
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, color:"#e11d48", fontWeight:600 }}>
          ↑ Carry the {carryVal}!
        </div>
      )}
    </div>
  );
}

function ColumnSubtraction({ a, b, borrow }) {
  const ans     = a - b;
  const maxLen  = Math.max(String(a).length, String(b).length, String(ans).length);
  const pad     = (n) => String(n).padStart(maxLen, " ").split("");
  const aDigits = pad(a);
  const bDigits = pad(b);
  const ansDigits = pad(ans);

  const OP_W = 36;
  const cellStyle = (highlight, faded) => ({
    width:40, height:44, display:"flex", alignItems:"center", justifyContent:"center",
    fontFamily:"'Fredoka', sans-serif", fontSize:24, fontWeight:700,
    color: highlight ? "#0ea5e9" : "#1e293b",
    background: highlight ? "#0ea5e922" : "transparent",
    borderRadius:8,
    opacity: faded ? 0 : 1,
  });
  const row = (digits, opSymbol, opColor, highlight) => (
    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
      <div style={{ width:OP_W, height:44, display:"flex", alignItems:"center", justifyContent:"center",
        fontFamily:"'Fredoka', sans-serif", fontSize:22, fontWeight:700, color: opColor || "transparent" }}>
        {opSymbol || ""}
      </div>
      {digits.map((d, i) => <div key={i} style={cellStyle(highlight, d === " ")}>{d === " " ? "" : d}</div>)}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:16, padding:"14px 20px", boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        {row(aDigits, null, null, false)}
        {row(bDigits, "−", "#0ea5e9", false)}
        <div style={{ width:"100%", height:2.5, background:"#0ea5e9", borderRadius:2, margin:"4px 0" }} />
        {row(ansDigits, null, null, true)}
      </div>
      {borrow && (
        <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, color:"#e11d48", fontWeight:600 }}>
          ↑ Borrow 10 from the tens!
        </div>
      )}
    </div>
  );
}

function TimesTableTips() {
  const tips = [
    { label:"× 1", rule:"Always the same number!", example:"7 × 1 = 7", color:"#4CAF50" },
    { label:"× 2", rule:"Double it!", example:"6 × 2 = 12", color:"#2196F3" },
    { label:"× 5", rule:"Ends in 0 or 5", example:"7 × 5 = 35", color:"#f59e0b" },
    { label:"× 10", rule:"Add a zero!", example:"4 × 10 = 40", color:"#8b5cf6" },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {tips.map(t => (
        <div key={t.label} style={{
          display:"flex", alignItems:"center", gap:12,
          background:`${t.color}12`, borderRadius:12, padding:"8px 14px",
          border:`2px solid ${t.color}30`,
        }}>
          <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:16, fontWeight:700, color:t.color, minWidth:40 }}>{t.label}</div>
          <div>
            <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:14, fontWeight:600, color:"#1e293b" }}>{t.rule}</div>
            <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:12, color:"#64748b" }}>{t.example}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BondsTo10() {
  const bonds = [[1,9],[2,8],[3,7],[4,6],[5,5]];
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
      {bonds.map(([a, b]) => (
        <div key={a} style={{
          display:"flex", alignItems:"center", gap:4,
          background:"rgba(255,255,255,0.7)", borderRadius:12, padding:"6px 12px",
          fontFamily:"'Fredoka', sans-serif", fontSize:16, fontWeight:700,
          border:"2px solid #06b6d433", color:"#06b6d4",
        }}>
          <span style={{ color:"#06b6d4" }}>{a}</span>
          <span style={{ color:"#94a3b8" }}>+</span>
          <span style={{ color:"#8b5cf6" }}>{b}</span>
          <span style={{ color:"#94a3b8" }}>=</span>
          <span style={{ color:"#1e293b" }}>10</span>
        </div>
      ))}
    </div>
  );
}

function MinuteCountingVisual() {
  const keyMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <ClockFace hours={3} minutes={25} color="#0284c7" size={150} showLabel={true} />
      <div style={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"center", maxWidth:280 }}>
        {keyMinutes.map(m => (
          <div key={m} style={{
            width:36, height:28, borderRadius:8,
            background: m === 25 ? "#0284c7" : "#0284c720",
            border:`1.5px solid #0284c744`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Fredoka', sans-serif", fontSize:12, fontWeight:700,
            color: m === 25 ? "white" : "#0284c7",
          }}>{m}</div>
        ))}
      </div>
      <div style={{ fontFamily:"'Fredoka', sans-serif", fontSize:13, color:"#64748b", fontWeight:500 }}>
        Count in 5s around the clock face!
      </div>
    </div>
  );
}

/* ─────────────────── TeachScreen ─────────────────── */

export default function TeachScreen({ opId, onBack, onPractice }) {
  const op      = OPERATIONS.find(o => o.id === opId);
  const steps   = TEACH_CONTENT[opId] || [];
  const [step, setStep] = useState(0);

  const current  = steps[step];
  const isLast   = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  function goNext() {
    SoundEngine.teachNext();
    if (isLast) {
      onPractice(opId);
    } else {
      setStep(s => s + 1);
    }
  }

  function goPrev() {
    SoundEngine.navigate();
    setStep(s => Math.max(0, s - 1));
  }

  if (!current) return null;

  return (
    <div style={{
      minHeight:"100vh", background:op.bg, fontFamily:"'Fredoka', sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"20px 16px",
    }}>
      <div style={{ maxWidth:460, width:"100%", animation:"fadeUp 0.4s ease" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <button onClick={() => { SoundEngine.navigate(); onBack(); }} style={{
            background:"rgba(255,255,255,0.7)", border:"none", borderRadius:12,
            padding:"8px 14px", fontFamily:"'Fredoka', sans-serif", fontWeight:600,
            color:"#64748b", cursor:"pointer", fontSize:14, whiteSpace:"nowrap",
          }}>← Home</button>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:24 }}>{op.emoji}</span>
              <span style={{ fontSize:18, fontWeight:700, color:op.color }}>Learn {op.name}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width:"100%", height:8, borderRadius:4, background:"#e2e8f0", overflow:"hidden", marginBottom:18 }}>
          <div style={{
            height:"100%", width:`${progress}%`, borderRadius:4,
            background:`linear-gradient(90deg, ${op.color}, ${op.color}cc)`,
            transition:"width 0.4s ease",
          }} />
        </div>
        <div style={{ fontSize:12, color:"#94a3b8", marginTop:-14, marginBottom:16, textAlign:"right", fontWeight:500 }}>
          Step {step + 1} of {steps.length}
        </div>

        {/* Content card */}
        <div style={{
          background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)",
          borderRadius:24, padding:"24px 20px", marginBottom:16,
          boxShadow:"0 8px 32px rgba(0,0,0,0.08)",
          border:`3px solid ${op.color}22`,
          animation:"fadeUp 0.35s ease",
          key: step,
        }}>
          <h2 style={{
            fontSize:22, fontWeight:700, color:"#1e293b",
            margin:"0 0 12px", lineHeight:1.3,
          }}>{current.title}</h2>

          <p style={{
            fontFamily:"'Fredoka', sans-serif", fontSize:16, color:"#64748b",
            fontWeight:500, lineHeight:1.6, margin:"0 0 20px",
          }}>{current.text}</p>

          {current.visual && (
            <div style={{ display:"flex", justifyContent:"center" }}>
              {current.visual()}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", gap:10 }}>
          {step > 0 && (
            <button onClick={goPrev} style={{
              padding:"14px 20px", borderRadius:16, border:"2px solid #e2e8f0",
              background:"rgba(255,255,255,0.8)", color:"#64748b",
              fontSize:16, fontWeight:700, fontFamily:"'Fredoka', sans-serif",
              cursor:"pointer",
            }}>← Back</button>
          )}
          <button onClick={goNext} style={{
            flex:1, padding:"14px 20px", borderRadius:16, border:"none",
            background: isLast ? op.gradient : `linear-gradient(135deg, ${op.color}dd, ${op.color})`,
            color:"white", fontSize:17, fontWeight:700,
            fontFamily:"'Fredoka', sans-serif", cursor:"pointer",
            boxShadow:`0 4px 16px ${op.color}44`, transition:"all 0.2s",
          }}>
            {isLast ? "⚡ Practice Now!" : "Next →"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { 0% { transform:scale(0); } 70% { transform:scale(1.2); } 100% { transform:scale(1); } }
      `}</style>
    </div>
  );
}
