export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateProblem(opId, lvlConfig, prevProblem = null) {
  const max = lvlConfig?.max ?? lvlConfig ?? 10;

  switch (opId) {

    case "addition": {
      const a = randomInt(1, max);
      const b = randomInt(1, Math.max(1, max - a));
      return { a, b, answer: a + b };
    }

    case "subtraction": {
      const a = randomInt(2, max);
      const b = randomInt(1, Math.max(1, a - 1));
      return { a, b, answer: a - b };
    }

    case "multiplication": {
      const a = randomInt(1, max);
      const b = randomInt(1, max);
      return { a, b, answer: a * b };
    }

    case "division": {
      const b = randomInt(1, max);
      const answer = randomInt(1, max);
      return { a: b * answer, b, answer };
    }

    case "addsub": {
      // 50% chance: reuse previous family, pick a different form
      let x, y, total;
      if (prevProblem?.family && Math.random() < 0.5) {
        ({ x, y, total } = prevProblem.family);
      } else {
        x = randomInt(1, max);
        y = randomInt(1, Math.max(1, max - x));
        total = x + y;
      }
      const family = { x, y, total };
      const forms = [
        { a: x,     b: y, answer: total, symbol: "+", familyType: "a+b" },
        { a: y,     b: x, answer: total, symbol: "+", familyType: "b+a" },
        { a: total, b: x, answer: y,     symbol: "−", familyType: "t-a" },
        { a: total, b: y, answer: x,     symbol: "−", familyType: "t-b" },
      ];
      // Avoid repeating same form
      const available = prevProblem?.family && prevProblem.familyType
        ? forms.filter(f => f.familyType !== prevProblem.familyType)
        : forms;
      return { ...randomChoice(available), family };
    }

    case "muldiv": {
      let x, y, total;
      if (prevProblem?.family && Math.random() < 0.5) {
        ({ x, y, total } = prevProblem.family);
      } else {
        x = randomInt(1, max);
        y = randomInt(1, max);
        total = x * y;
      }
      const family = { x, y, total };
      const forms = [
        { a: x,     b: y, answer: total, symbol: "×", familyType: "a*b" },
        { a: y,     b: x, answer: total, symbol: "×", familyType: "b*a" },
        { a: total, b: x, answer: y,     symbol: "÷", familyType: "t/a" },
        { a: total, b: y, answer: x,     symbol: "÷", familyType: "t/b" },
      ];
      const available = prevProblem?.family && prevProblem.familyType
        ? forms.filter(f => f.familyType !== prevProblem.familyType)
        : forms;
      return { ...randomChoice(available), family };
    }

    case "numbonds": {
      const total = randomInt(2, max);
      const partA = randomInt(1, total - 1);
      const partB = total - partA;
      const missing = Math.random() < 0.5 ? "partA" : "partB";
      const answer = missing === "partA" ? partA : partB;
      const known  = missing === "partA" ? partB : partA;
      return { total, partA, partB, missing, answer, a: total, b: known, displayType: "numbonds" };
    }

    case "placevalue": {
      const placeType = lvlConfig?.placeType ?? "tens";

      if (placeType === "decimals") {
        const intPart  = randomInt(1, 9);
        const tenths   = randomInt(0, 9);
        const hundredths = randomInt(0, 9);
        const number   = parseFloat(`${intPart}.${tenths}${hundredths}`);
        const askCol   = randomChoice(["tenths", "hundredths"]);
        const answer   = askCol === "tenths" ? tenths : hundredths;
        return { number, askCol, answer, a: number, b: 0, displayType: "placevalue", placeType };
      }

      const number = randomInt(
        placeType === "thousands" ? 1000 : placeType === "hundreds" ? 100 : 10,
        max
      );
      const numStr  = String(number);
      const colOpts = placeType === "thousands"
        ? ["ones","tens","hundreds","thousands"]
        : placeType === "hundreds"
          ? ["ones","tens","hundreds"]
          : ["ones","tens"];

      const questionTypes = ["digit", "value"];
      const qType = randomChoice(questionTypes);
      const askCol = randomChoice(colOpts);

      const colIndex = { ones: 0, tens: 1, hundreds: 2, thousands: 3 }[askCol];
      const digit = parseInt(numStr[numStr.length - 1 - colIndex]) || 0;
      const placeMultiplier = { ones: 1, tens: 10, hundreds: 100, thousands: 1000 }[askCol];
      const answer = qType === "digit" ? digit : digit * placeMultiplier;

      return { number, askCol, qType, digit, answer, a: number, b: 0, displayType: "placevalue", placeType };
    }

    case "fractions": {
      const fracType = lvlConfig?.fracType ?? "basic";

      if (fracType === "basic") {
        const denominator = randomChoice([2, 3, 4]);
        const numerator   = randomInt(1, denominator - 1);
        const qType = randomChoice(["shaded", "total"]);
        return {
          numerator, denominator, qType,
          answer: qType === "shaded" ? numerator : denominator,
          a: numerator, b: denominator, displayType: "fractions", fracType,
        };
      }

      if (fracType === "extended") {
        const denominator = randomChoice([3, 4, 5, 6]);
        const numerator   = randomInt(1, denominator - 1);
        const qType = randomChoice(["shaded", "total"]);
        return {
          numerator, denominator, qType,
          answer: qType === "shaded" ? numerator : denominator,
          a: numerator, b: denominator, displayType: "fractions", fracType,
        };
      }

      if (fracType === "equivalent") {
        const basePairs = [[1,2],[1,3],[1,4],[2,3],[3,4],[1,5],[2,5]];
        const [num, den] = randomChoice(basePairs);
        const multiplier    = randomChoice([2, 3, 4]);
        const equivNum  = num * multiplier;
        const equivDen  = den * multiplier;
        // Ask: num/den = ?/equivDen  →  answer = equivNum
        return {
          numerator: num, denominator: den,
          equivNumerator: equivNum, equivDenominator: equivDen,
          qType: "equivalent", answer: equivNum,
          a: num, b: den, displayType: "fractions", fracType,
        };
      }

      // advanced: mixed questions including comparing
      const denominator = randomInt(2, 10);
      const numerator   = randomInt(1, denominator);
      const qType = randomChoice(["shaded", "total", "value"]);
      let answer;
      if (qType === "shaded") answer = numerator;
      else if (qType === "total") answer = denominator;
      else answer = numerator; // "value" - same as shaded but phrased differently
      return {
        numerator, denominator, qType,
        answer, a: numerator, b: denominator, displayType: "fractions", fracType,
      };
    }

    case "time": {
      const timeType = lvlConfig?.timeType ?? "basic";
      const hours    = randomInt(1, 12);
      let minutes;

      if      (timeType === "basic")   minutes = randomChoice([0, 30]);
      else if (timeType === "quarter") minutes = randomChoice([0, 15, 30, 45]);
      else if (timeType === "five")    minutes = randomChoice([0,5,10,15,20,25,30,35,40,45,50,55]);
      else                             minutes = randomInt(0, 59);

      // ~30% chance of "readtime" (no hint — just "What time does the clock show?")
      const askTypeOptions = Math.random() < 0.3
        ? ["readtime"]
        : ["hour", "minute"];
      const askType = randomChoice(askTypeOptions);

      const answer = askType === "readtime"
        ? `${hours}:${String(minutes).padStart(2, "0")}`
        : askType === "hour"
          ? hours
          : minutes;
      return { hours, minutes, askType, answer, a: hours, b: minutes, displayType: "time", timeType };
    }

    default:
      return { a: 1, b: 1, answer: 2 };
  }
}

export function getSymbol(opId, problem) {
  if (problem?.symbol) return problem.symbol;
  const symbols = {
    addition: "+", subtraction: "−", multiplication: "×", division: "÷",
    addsub: "+", muldiv: "×", numbonds: "+", placevalue: "=",
    fractions: "/", time: ":",
  };
  return symbols[opId] ?? "+";
}

export function formatTime(hours, minutes) {
  const h = hours;
  const m = String(minutes).padStart(2, "0");
  return `${h}:${m}`;
}

export function timeLabel(hours, minutes) {
  if (minutes === 0)  return `${hours} o'clock`;
  if (minutes === 30) return `half past ${hours}`;
  if (minutes === 15) return `quarter past ${hours}`;
  if (minutes === 45) return `quarter to ${hours === 12 ? 1 : hours + 1}`;
  if (minutes < 30)   return `${minutes} minutes past ${hours}`;
  return `${60 - minutes} minutes to ${hours === 12 ? 1 : hours + 1}`;
}
