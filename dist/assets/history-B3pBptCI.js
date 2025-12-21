import{g as v}from"./navbar-gesture-vdOknNZq.js";import"./firebase-CCPgoP9_.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";import"https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm";const r={phonepe:"/assets/icons/phonepe.svg",gpay:"/assets/icons/gpay.svg",paytm:"/assets/icons/paytm.svg",cash:"/assets/icons/cash.svg",bank:"/assets/icons/bank.svg",card:"/assets/icons/card.svg"},g={phonepe:"PhonePe",gpay:"Google Pay",paytm:"Paytm",cash:"Cash",bank:"Bank",card:"Card"};function y(s){return(typeof s=="number"?new Date(s):new Date(s)).toLocaleDateString(void 0,{month:"short",day:"numeric"})}window.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("historyList"),o=document.getElementById("transactionsUl"),c=document.getElementById("filterSource"),m=v();if(!s&&!o)return;function f(n,t){if(n){if(t.length===0){n.innerHTML="<p>No transactions yet</p>";return}n.innerHTML=t.map(e=>{const d=r[e.source]||r.cash,l=e.timestamp?y(e.timestamp):e.date||"",p=e.type==="expense"?"#dc2626":"#16a34a",i=e.type==="expense"?"-":"+",a=e.sourceLabel||g[e.source]||e.source||"Cash";return`
        <div class="list-item">
          <div style="display:flex; gap:10px; align-items:center;">
            <img src="${d}" alt="${a}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;" />
            <div>
              <strong>₹${e.amount} • ${e.category}</strong><br>
              <small style="color:#64748b">${a} • ${l} ${e.note?"• "+e.note:""}</small>
            </div>
          </div>
          <div style="color:${p}; font-weight:700">
            ${i}₹${e.amount}
          </div>
        </div>
      `}).join("")}}function h(n,t){if(n){if(t.length===0){n.innerHTML="<li>No transactions yet</li>";return}n.innerHTML=t.slice(0,8).map(e=>{const d=r[e.source]||r.cash,l=e.type==="expense"?"#dc2626":"#16a34a",p=e.type==="expense"?"-":"+",i=e.sourceLabel||g[e.source]||e.source||"Cash",a=e.timestamp?y(e.timestamp):e.date||"";return`
        <li style="display:flex; justify-content:space-between; align-items:center; padding:8px 0;">
          <div style="display:flex; gap:10px; align-items:center">
            <img src="${d}" alt="${i}" style="width:34px; height:34px; border-radius:8px; object-fit:cover;" />
            <div>
              <div style="font-weight:700">₹${e.amount} • ${e.category}</div>
              <div style="font-size:12px; color:#64748b">${i} • ${a}</div>
            </div>
          </div>
          <div style="color:${l}; font-weight:700">${p}₹${e.amount}</div>
        </li>
      `}).join("")}}function u(){const n=c?.value||"all",t=n==="all"?m:m.filter(e=>e.source===n);s&&f(s,t),o&&h(o,t)}u(),c&&c.addEventListener("change",()=>u())});
