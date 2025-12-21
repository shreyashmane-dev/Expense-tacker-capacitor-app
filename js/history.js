import { getTransactions } from "./db.js";

const SOURCE_ICONS = {
  phonepe: "/assets/icons/phonepe.svg",
  gpay: "/assets/icons/gpay.svg",
  paytm: "/assets/icons/paytm.svg",
  cash: "/assets/icons/cash.svg",
  bank: "/assets/icons/bank.svg",
  card: "/assets/icons/card.svg"
};

const SOURCE_NAMES = {
  phonepe: 'PhonePe',
  gpay: 'Google Pay',
  paytm: 'Paytm',
  cash: 'Cash',
  bank: 'Bank',
  card: 'Card'
};

function fmtDate(tsOrIso) {
  const d = typeof tsOrIso === 'number' ? new Date(tsOrIso) : new Date(tsOrIso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

window.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById("historyList");
  const recent = document.getElementById("transactionsUl");
  const filter = document.getElementById("filterSource");
  const txns = getTransactions();

  if ((!list) && (!recent)) return;

  function renderFull(listEl, items) {
    if (!listEl) return;
    if (items.length === 0) {
      listEl.innerHTML = "<p>No transactions yet</p>";
      return;
    }

    listEl.innerHTML = items.map(t => {
      const icon = SOURCE_ICONS[t.source] || SOURCE_ICONS.cash;
      const when = t.timestamp ? fmtDate(t.timestamp) : (t.date || '');
      const amtColor = t.type === "expense" ? "#dc2626" : "#16a34a";
      const sign = t.type === "expense" ? "-" : "+";
      const sourceLabel = t.sourceLabel || SOURCE_NAMES[t.source] || (t.source || 'Cash');

      return `
        <div class="list-item">
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${icon}" alt="${sourceLabel}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;" />
            <div>
              <strong>₹${t.amount} • ${t.category}</strong><br>
              <small style="color:#64748b">${sourceLabel} • ${when} ${t.note ? '• ' + t.note : ''}</small>
            </div>
          </div>
          <div style="color:${amtColor}; font-weight:700">
            ${sign}₹${t.amount}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderRecent(listEl, items) {
    if (!listEl) return;
    if (items.length === 0) {
      listEl.innerHTML = "<li>No transactions yet</li>";
      return;
    }

    listEl.innerHTML = items.slice(0,8).map(t => {
      const icon = SOURCE_ICONS[t.source] || SOURCE_ICONS.cash;
      const amtColor = t.type === "expense" ? "#dc2626" : "#16a34a";
      const sign = t.type === "expense" ? "-" : "+";
      const sourceLabel = t.sourceLabel || SOURCE_NAMES[t.source] || (t.source || 'Cash');
      const when = t.timestamp ? fmtDate(t.timestamp) : (t.date || '');

      return `
        <li style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
          <div style="display:flex; gap:10px; align-items:center">
            <img src="${icon}" alt="${sourceLabel}" style="width:34px; height:34px; border-radius:8px; object-fit:cover;" />
            <div>
              <div style="font-weight:700">₹${t.amount} • ${t.category}</div>
              <div style="font-size:12px; color:#64748b">${sourceLabel} • ${when}</div>
            </div>
          </div>
          <div style="color:${amtColor}; font-weight:700">${sign}₹${t.amount}</div>
        </li>
      `;
    }).join("");
  }

  function applyFilter() {
    const sel = filter?.value || 'all';
    const items = sel === 'all' ? txns : txns.filter(t => t.source === sel);
    if (list) renderFull(list, items);
    if (recent) renderRecent(recent, items);
  }

  // initial render
  applyFilter();

  // attach filter handler if filter exists
  if (filter) {
    filter.addEventListener('change', () => applyFilter());
  }
});
