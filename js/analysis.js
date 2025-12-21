import { getTxns } from "./storage.js";
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

Chart.register(...registerables);

const txns = getTxns() || [];

const insightsEl = document.getElementById("insights");
if (!txns.length) {
  if (insightsEl) insightsEl.innerHTML = "<p>No data yet. Add some transactions.</p>";
}

/* ========= INCOME vs EXPENSE ========= */
let income = 0, expense = 0;
const categoryMap = {};

txns.forEach(t => {
  const amt = Number(t.amount) || 0;
  if (t.type === "income") income += amt;
  else expense += amt;

  if (t.type === "expense") {
    const cat = t.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + amt;
  }
});

const ieCtx = document.getElementById("incomeExpenseChart");
if (ieCtx) {
  new Chart(ieCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

/* ========= CATEGORY PIE ========= */
const catCtx = document.getElementById("categoryChart");
if (catCtx && Object.keys(categoryMap).length > 0) {
  new Chart(catCtx, {
    type: "doughnut",
    data: {
      labels: Object.keys(categoryMap),
      datasets: [{
        data: Object.values(categoryMap),
        backgroundColor: [
          "#60a5fa","#34d399","#fbbf24",
          "#f87171","#a78bfa"
        ]
      }]
    }
  });
} else if (catCtx) {
  // hide empty chart to avoid rendering errors
  catCtx.style.display = 'none';
}

/* ========= INSIGHTS ========= */
const topCategory = Object.entries(categoryMap).sort((a,b) => b[1] - a[1])[0];

if (insightsEl) {
  insightsEl.innerHTML = `\
    <h3>Insights</h3>\
    <p>Total Income: ₹${income.toLocaleString()}</p>\
    <p>Total Expense: ₹${expense.toLocaleString()}</p>\
    <p>Balance: ₹${(income - expense).toLocaleString()}</p>\
    ${topCategory ? `<p>Top spend: ${topCategory[0]} (₹${topCategory[1].toLocaleString()})</p>` : ""}\
  `;
}
