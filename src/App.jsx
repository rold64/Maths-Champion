import { useState } from "react";
import Homepage      from "./screens/Homepage.jsx";
import LevelSelect   from "./screens/LevelSelect.jsx";
import GameScreen    from "./screens/GameScreen.jsx";
import TeachScreen   from "./screens/TeachScreen.jsx";
import TenFrameScreen from "./screens/TenFrameScreen.jsx";

export default function MathsChampion() {
  const [screen,        setScreen]        = useState("home");
  const [selectedOp,    setSelectedOp]    = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  function goHome()   { setScreen("home"); }
  function goLevels() { setScreen("levels"); }

  function handlePractice(opId) {
    setSelectedOp(opId);
    setScreen("levels");
  }

  function handleLearn(opId) {
    setSelectedOp(opId);
    setScreen("teach");
  }

  // "Practice Now!" from TeachScreen goes straight to level select
  function handleTeachPractice(opId) {
    setSelectedOp(opId);
    setScreen("levels");
  }

  return (
    <>
      {screen === "home" && (
        <Homepage
          onPractice={handlePractice}
          onLearn={handleLearn}
        />
      )}

      {screen === "teach" && (
        <TeachScreen
          opId={selectedOp}
          onBack={goHome}
          onPractice={handleTeachPractice}
        />
      )}

      {screen === "levels" && (
        <LevelSelect
          opId={selectedOp}
          onSelectLevel={(lvlIdx) => { setSelectedLevel(lvlIdx); setScreen("game"); }}
          onBack={goHome}
        />
      )}

      {screen === "game" && selectedOp !== "tenframe" && (
        <GameScreen
          key={`${selectedOp}-${selectedLevel}-${Date.now()}`}
          opId={selectedOp}
          levelIdx={selectedLevel}
          onHome={goHome}
          onLevelSelect={goLevels}
        />
      )}

      {screen === "game" && selectedOp === "tenframe" && (
        <TenFrameScreen
          key={`${selectedOp}-${selectedLevel}-${Date.now()}`}
          opId={selectedOp}
          levelIdx={selectedLevel}
          onHome={goHome}
          onLevelSelect={goLevels}
        />
      )}
    </>
  );
}
