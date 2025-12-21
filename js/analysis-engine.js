import { getTransactions } from "./db.js";

export function analyze() {
  const txns = getTransactions() || [];

  let income = 0, expense = 0;
  const byCategory = {};
  const byDate = {};

  txns.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === "income") income += amt;
    else expense += amt;

    if (t.type === "expense") {
      const cat = t.category || 'Uncategorized';
      byCategory[cat] = (byCategory[cat] || 0) + amt;
    }

    const dateStr = t.date || '';
    const m = dateStr.slice(0,7);
    if (m) {
      byDate[m] = (byDate[m] || 0) + (t.type === "expense" ? amt : -amt);
    }
  });

  return { income, expense, byCategory, byDate };
}
