import { getTransactions, addTransaction } from "./db.js";

export function getTxns() {
  return getTransactions();
}

export function saveTxn(txn) {
  return addTransaction(txn);
}
