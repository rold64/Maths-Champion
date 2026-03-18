// Returns a suggestion: "up", "down", or null
export function getSuggestion(opId, levelIdx, recentAccuracy, totalLevels = 4) {
  if (!recentAccuracy || recentAccuracy.length < 2) return null;

  // Need at least 2 games to suggest
  const last = recentAccuracy.slice(-3);
  const avg  = last.reduce((s, v) => s + v, 0) / last.length;

  if (avg >= 85 && levelIdx < totalLevels - 1) return "up";
  if (avg <= 40 && levelIdx > 0)               return "down";
  return null;
}

export function suggestionMessage(direction, levelIdx, levels) {
  if (direction === "up") {
    return `You're doing brilliantly! Ready to try ${levels[levelIdx + 1]?.name} level? 🚀`;
  }
  if (direction === "down") {
    return `Let's build confidence at ${levels[levelIdx - 1]?.name} level first! 💪`;
  }
  return null;
}
