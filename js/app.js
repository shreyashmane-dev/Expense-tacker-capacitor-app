/* ===============================
   FINAL APP CONTROLLER
   (localStorage-based auth + UI helpers)
================================ */
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { renderCharts } from "./charts.js";
import { aiQuery } from "./ai-engine.js";

// ---- AUTH GUARD ----
const user = JSON.parse(localStorage.getItem("user"));

const publicPages = ["login.html", "signup.html"];
const currentPage = location.pathname.split("/").pop();

if (!user && !publicPages.includes(currentPage)) {
  location.href = "../auth/login.html";
}

if (user && publicPages.includes(currentPage)) {
  location.href = "../dashboard/home.html";
}

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

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;

  const isAuthPage =
    path.includes("/auth/login.html") ||
    path.includes("/auth/signup.html");

  if (!user && !isAuthPage) {
    // ❌ Not logged in → force login
    window.location.replace("/auth/login.html");
    return;
  }

  if (user && isAuthPage) {
    // ✅ Logged in → skip login/signup
    window.location.replace("/dashboard/home.html");
    return;
  }

  // ✅ Logged in & dashboard page
  if (user) initDashboard();
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
