import"./firebase-CCPgoP9_.js";import"./navbar-gesture-vdOknNZq.js";import{g as i}from"./home-CMtZIXtU.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";import"https://cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm";document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("transactionsUl");if(!n)return;const e=i();if(!e.length){n.innerHTML='<li class="empty">No transactions yet</li>';return}n.innerHTML=e.map(t=>`
      <li>
        <div class="left"><strong>${t.category}</strong><br><small>${t.note||""} • ${t.date}</small></div>
        <div class="right ${t.type}">${t.type==="expense"?"-":"+"}₹${t.amount}</div>
      </li>
    `).join("")});
