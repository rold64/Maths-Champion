const SoundEngine = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function playTone(freq, duration, type = "sine", volume = 0.15, delay = 0) {
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, c.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration);
    } catch (e) {}
  }

  return {
    tap()            { playTone(880, 0.06, "sine", 0.08); },
    backspace()      { playTone(440, 0.05, "square", 0.04); },
    correct() {
      playTone(523, 0.12, "sine", 0.18, 0);
      playTone(659, 0.12, "sine", 0.18, 0.1);
      playTone(784, 0.2,  "sine", 0.2,  0.2);
    },
    wrong() {
      playTone(250, 0.25, "triangle", 0.12, 0);
      playTone(200, 0.35, "triangle", 0.1,  0.15);
    },
    streak() {
      playTone(660,  0.1,  "sine", 0.15, 0);
      playTone(880,  0.1,  "sine", 0.15, 0.08);
      playTone(1100, 0.1,  "sine", 0.15, 0.16);
      playTone(1320, 0.25, "sine", 0.18, 0.24);
    },
    victory() {
      playTone(523,  0.15, "sine",     0.18, 0);
      playTone(659,  0.15, "sine",     0.18, 0.12);
      playTone(784,  0.15, "sine",     0.18, 0.24);
      playTone(1047, 0.35, "sine",     0.22, 0.36);
      playTone(784,  0.1,  "triangle", 0.08, 0.36);
      playTone(1047, 0.1,  "triangle", 0.08, 0.46);
    },
    selectChallenge() {
      playTone(520, 0.1,  "sine", 0.12, 0);
      playTone(780, 0.15, "sine", 0.14, 0.08);
    },
    selectLevel() {
      playTone(600,  0.08, "sine", 0.1,  0);
      playTone(800,  0.08, "sine", 0.12, 0.07);
      playTone(1000, 0.14, "sine", 0.14, 0.14);
    },
    navigate() {
      playTone(600, 0.08, "sine", 0.08, 0);
      playTone(450, 0.12, "sine", 0.06, 0.06);
    },
    // Teach mode: gentle "page turn"
    teachNext() {
      playTone(700, 0.08, "sine", 0.1, 0);
      playTone(900, 0.12, "sine", 0.12, 0.07);
    },
  };
})();

export default SoundEngine;
