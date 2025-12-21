import { getTransactions } from "./db.js";
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm';

Chart.register(...registerables);

// Render charts using Chart.js
export function renderCharts() {
  const txs = getTransactions().filter(t => t.type === "expense");

  /* CATEGORY PIE */
  const categoryData = {};
  txs.forEach(t => {
    const amt = Number(t.amount) || 0;
    categoryData[t.category] = (categoryData[t.category] || 0) + amt;
  });

  const categoryCanvas = document.getElementById("categoryChart");
  if (categoryCanvas) {
    if (window.categoryChart) window.categoryChart.destroy();
    window.categoryChart = new Chart(categoryCanvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          data: Object.values(categoryData),
          backgroundColor: ["#60a5fa", "#93c5fd", "#bfdbfe", "#38bdf8", "#7dd3fc", "#34d399", "#fb7185"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  /* MONTHLY TREND */
  const monthly = {};
  txs.forEach(t => {
    const d = new Date(t.date);
    const m = isNaN(d) ? t.date : d.toLocaleString('default',{month:'short', year:'numeric'});
    monthly[m] = (monthly[m] || 0) + (Number(t.amount) || 0);
  });

  const trendCanvas = document.getElementById("trendChart");
  if (trendCanvas) {
    if (window.trendChart) window.trendChart.destroy();
    window.trendChart = new Chart(trendCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: Object.keys(monthly),
        datasets: [{
          label: 'Monthly Expense',
          data: Object.values(monthly),
          borderColor: '#2563eb',
          fill: true,
          backgroundColor: 'rgba(37,99,235,0.15)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  /* INSIGHTS */
  const insights = document.getElementById('insights');
  if (insights) {
    const highest = Object.entries(categoryData).sort((a,b)=>b[1]-a[1])[0];
    const total = txs.reduce((a,b)=>a + (Number(b.amount)||0), 0);
    insights.innerHTML = `\n      <h3>Insights</h3>\n      <p>💸 Highest spending category: <b>${highest?.[0] || 'N/A'}</b></p>\n      <p>📊 Total expenses: ₹${total}</p>\n    `;
  }
}
