/* ===============================
   FINAL APP CONTROLLER
   (localStorage-based auth + UI helpers)
================================ */
import { auth, onAuthStateChanged } from "./firebase.js";
import { renderCharts } from "./charts.js";
import { aiQuery } from "./ai-engine.js";

// ---- AUTH GUARD (Delegated to firebase/auth in auth-guard.js) ----
// Legacy check removed to prevent conflict with Firebase Auth
console.log("App Controller Loaded");

// ---- NAVBAR ACTIVE TAB (reliable across paths & Capacitor) ----
function setActiveNavbar() {
  const page = location.pathname.split("/").pop().replace(".html", "");
  document.querySelectorAll(".navbar a").forEach(link => {
    if (link.dataset.page === page) link.classList.add("active");
  });
}

// Ensure active state is applied after DOM is ready
document.addEventListener('DOMContentLoaded', setActiveNavbar);

// ---- MICRO CLICK ANIMATION ----
document.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    e.target.style.transform = "scale(0.95)";
    setTimeout(() => e.target.style.transform = "scale(1)", 120);
  }
});

// ---- HAPTIC FEEDBACK (ANDROID) ----
if (window.Capacitor?.isNativePlatform && window.Capacitor.isNativePlatform()) {
  document.addEventListener("click", () => {
    try {
      Capacitor.Plugins.Haptics.impact({ style: "light" });
    } catch {}
  });
}

/* -------------------------------
   1. AUTH FLOW CONTROL
-------------------------------- */

/* -------------------------------
   1. AUTH FLOW CONTROL
-------------------------------- */

onAuthStateChanged(auth, (user) => {
  // Logic is now handled centrally in js/auth-guard.js
  // We only initialize the dashboard here if authenticated.
  
  if (user) {
    initDashboard();
  }
});

/* -------------------------------
   2. DASHBOARD INITIALIZATION
-------------------------------- */

function initDashboard() {
  loadNavbar();
  initPageLogic();
}

/* -------------------------------
   3. NAVBAR LOADER
-------------------------------- */

function loadNavbar() {
  // If a navbar already exists in the page (we now inline it), skip fetching
  if (document.querySelector('.navbar')) return;

  const nav = document.getElementById("navbar");
  if (!nav) return;

  fetch("/dashboard/navbar.html")
    .then((r) => r.text())
    .then((html) => {
      nav.innerHTML = html;
      import("./navbar.js").then(module => {
        if (module.initNavbar) module.initNavbar();
      }).catch(err => {
        console.error("Failed to load navbar.js:", err);
      });
    })
    .catch(err => {
      console.error("Failed to load navbar.html:", err);
    });
}

/* -------------------------------
   4. PAGE-SPECIFIC LOGIC
-------------------------------- */

function initPageLogic() {
  // HOME (summary)
  if (document.getElementById("income")) {
    if (!document.querySelector('script[src$="home.js"]')) {
      import("./home.js").catch(err => console.error('home load failed', err));
    }
  }

  // HISTORY
  if (document.getElementById("historyList") || document.getElementById("transactionsUl")) {
    if (!document.querySelector('script[src$="history.js"]')) {
      import("./history.js").catch(err => console.error('history load failed', err));
    }
  }

  // ANALYSIS
  if (
    document.getElementById("categoryChart") ||
    document.getElementById("trendChart") ||
    document.getElementById("incomeExpenseChart")
  ) {
    // If analysis module not already included, import it; otherwise charts are rendered by the page script
    if (!document.querySelector('script[src$="analysis.js"]')) {
      import("./analysis.js").catch(err => console.error('analysis load failed', err));
    }
  }

  // AI ASSISTANT
  const aiBtn = document.getElementById("aiAskBtn");
  if (aiBtn) {
    aiBtn.addEventListener("click", () => {
      const input = document.getElementById("aiInput");
      const output = document.getElementById("aiOutput");
      if (!input.value.trim()) return;
      output.textContent = aiQuery(input.value);
      input.value = "";
    });
  }
}

// ===============================
// AUTO-REFRESH ON SMS TRANSACTION
// ===============================
window.addEventListener("transactionAdded", () => {
  // Refresh transactions list if on history page
  if (document.getElementById("transactionsUl") || document.getElementById("historyList")) {
    import("./history.js").then(module => {
      // history.js runs on DOMContentLoaded to render
    }).catch(() => {});
  }
  
  // Refresh charts if on analysis page
  if (document.getElementById("categoryChart") || document.getElementById("trendChart")) {
    import("./charts.js").then(module => {
      if (module.renderCharts) module.renderCharts();
    });
  }
  
  // Refresh summary if on home page
  if (document.getElementById("income")) {
    import("./home.js").then(() => {}).catch(() => {});
  }
});

// ===============================
// OFFLINE/ONLINE UX (Netlify Safe)
// ===============================
window.addEventListener("offline", () => {
  const status = document.createElement('div');
  status.id = "connection-status";
  status.style = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#ef4444; color:white; padding:8px 16px; border-radius:30px; font-size:12px; font-weight:bold; z-index:9999; box-shadow:0 10px 25px rgba(239,68,68,0.4); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(10px); animation: slideUp 0.4s ease;";
  status.innerHTML = "<span>⚠️ Offline Mode</span>";
  document.body.appendChild(status);
});

window.addEventListener("online", () => {
  const status = document.getElementById("connection-status");
  if (status) {
    status.style.background = "#10b981";
    status.style.boxShadow = "0 10px 25px rgba(16,185,129,0.4)";
    status.innerHTML = "<span>🌐 Back Online! Syncing...</span>";
    setTimeout(() => status.remove(), 3000);
  }
});

// CSS Animation for the status bar
const style = document.createElement('style');
style.textContent = `
@keyframes slideUp {
  from { transform: translate(-50%, 50px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}
`;
document.head.appendChild(style);

