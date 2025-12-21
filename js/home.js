import { calculateSummary } from "./transactions.js";

window.addEventListener('DOMContentLoaded', () => {
  const { income, expense, balance } = calculateSummary();

  const incEl = document.getElementById("income");
  const expEl = document.getElementById("expense");
  const balEl = document.getElementById("balance");

  if (incEl) incEl.innerText = "₹" + income;
  if (expEl) expEl.innerText = "₹" + expense;
  if (balEl) balEl.innerText = "₹" + balance;

  // Wire Add Transaction button
  const addBtn = document.getElementById('addTxnBtn');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.addManualTransaction) window.addManualTransaction();
      else {
        // fallback to module export if available
        import('./transactions.js').then(m => {
          if (m.addManualTransactionFromUI) m.addManualTransactionFromUI();
        }).catch(() => {});
      }
    });
  }
});
