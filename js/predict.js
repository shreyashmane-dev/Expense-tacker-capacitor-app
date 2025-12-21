import { getTransactions } from "./db.js";

export function predictNextMonth() {
  const txns = getTransactions().filter(t => t.type === "expense");
  
  if (!txns.length) return 0;

  // Calculate average daily expense
  const total = txns.reduce((sum, t) => sum + t.amount, 0);
  const avgDaily = total / txns.length;
  
  // Estimate for 30 days
  return Math.round(avgDaily * 30);
}

export function getPredictionInsight() {
  const prediction = predictNextMonth();
  
  if (prediction === 0) {
    return "Start tracking expenses to see predictions!";
  }
  
  return `Estimated next month spending: ₹${prediction.toLocaleString('en-IN')}`;
}
