const DB_KEY = "expense_transactions";

export function getTransactions() {
  return JSON.parse(localStorage.getItem(DB_KEY)) || [];
}

export function saveTransactions(transactions) {
  localStorage.setItem(DB_KEY, JSON.stringify(transactions));
}

export function addTransaction(txn) {
  const transactions = getTransactions();
  transactions.unshift(txn);
  saveTransactions(transactions);
}

export function deleteTransaction(id) {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
}
