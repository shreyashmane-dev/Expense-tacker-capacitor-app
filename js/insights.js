import { analyze } from "./analysis-engine.js";

export function getInsights() {
  const { expense, byCategory } = analyze();

  const top = Object.entries(byCategory)
    .sort((a,b) => b[1] - a[1])[0];

  if (!top) return "No data yet. Start tracking your expenses!";

  return `You spent most on ${top[0]} (₹${top[1].toLocaleString('en-IN')}).`;
}
