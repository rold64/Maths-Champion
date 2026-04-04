const KEY = "mathschamp_v1";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

// Record key: "{opId}_{levelIdx}"
function recordKey(opId, levelIdx) {
  return `${opId}_${levelIdx}`;
}

export function saveResult(opId, levelIdx, score, totalRounds) {
  const data = load();
  const key  = recordKey(opId, levelIdx);
  const prev = data[key] || { bestScore: 0, gamesPlayed: 0, recentAccuracy: [] };

  const accuracy = Math.round((score / totalRounds) * 100);
  const recent   = [...(prev.recentAccuracy || []), accuracy].slice(-5); // keep last 5

  data[key] = {
    bestScore:      Math.max(prev.bestScore, score),
    gamesPlayed:    prev.gamesPlayed + 1,
    recentAccuracy: recent,
  };
  save(data);
  return data[key];
}

export function getRecord(opId, levelIdx) {
  const data = load();
  return data[recordKey(opId, levelIdx)] || { bestScore: 0, gamesPlayed: 0, recentAccuracy: [] };
}

export function getAllRecords() {
  return load();
}

export function getCoins() {
  const data = load();
  return data.coins || 0;
}

export function addCoins(amount) {
  const data = load();
  data.coins = (data.coins || 0) + amount;
  save(data);
  return data.coins;
}

export function getDiamonds() {
  const data = load();
  return data.diamonds || 0;
}

export function addDiamonds(amount) {
  const data = load();
  data.diamonds = (data.diamonds || 0) + amount;
  save(data);
  return data.diamonds;
}
