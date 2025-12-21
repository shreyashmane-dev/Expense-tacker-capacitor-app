import { getTransactions } from "./db.js";

export function exportCSV() {
  const rows = getTransactions();
  
  if (!rows.length) {
    alert("No transactions to export!");
    return;
  }

  let csv = "Date,Type,Category,Amount,Payment Mode\n";

  rows.forEach(r => {
    csv += `${r.date},${r.type},${r.category},${r.amount},${r.paymentMode}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `expenses_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  
  // Clean up
  URL.revokeObjectURL(a.href);
}
