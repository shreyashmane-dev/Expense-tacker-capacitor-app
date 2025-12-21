import { getTransactions, addTransaction } from "./db.js";

export function aiQuery(text) {
  text = (text || '').toLowerCase();
  const txs = getTransactions() || [];

  if (text.includes("balance")) {
    let income = 0, expense = 0;
    txs.forEach(t => { if (t.type === 'income') income += Number(t.amount)||0; else expense += Number(t.amount)||0; });
    return `Your balance is ₹${(income - expense).toLocaleString()}`;
  }

  if (text.includes("today")) {
    const today = new Date().toISOString().split('T')[0];
    const sum = txs.filter(t => t.date === today && t.type === 'expense').reduce((a,b)=>a + (Number(b.amount)||0),0);
    return `You spent ₹${sum.toLocaleString()} today`;
  }

  const cats = ["food","shopping","travel","upi","entertainment","salary","bills"];
  for (let c of cats) {
    if (text.includes(c)) {
      const sum = txs.filter(t => (t.category||'').toLowerCase() === c && t.type === 'expense').reduce((a,b)=>a + (Number(b.amount)||0),0);
      return `You spent ₹${sum.toLocaleString()} on ${c}`;
    }
  }

  const amt = text.match(/(\d+[\d,]*)/)?.[1]?.replace(/,/g, '');
  if (text.includes('add') && amt) {
    const amount = Number(amt);
    const tx = { id: Date.now(), amount, type: text.includes('income') ? 'income' : 'expense', category: 'AI', date: new Date().toISOString().split('T')[0], source: 'ai' };
    addTransaction(tx);
    return `Added ₹${amount.toLocaleString()} transaction successfully`;
  }

  // use YYYY-MM prefix for month matching (works with ISO dates)
  const currentMonth = new Date().toISOString().slice(0,7);
  const mSum = txs.filter(t => (t.date||'').startsWith(currentMonth) && t.type === 'expense').reduce((a,b)=>a + (Number(b.amount)||0),0);
  if (mSum > 10000) return "⚠️ You are overspending this month. Consider reducing expenses.";

  return "🤖 I can help with balance, spending, add expense, and insights.";
}

// keep legacy global for simple pages that call askAI
if (typeof window !== 'undefined') window.askAI = aiQuery;
