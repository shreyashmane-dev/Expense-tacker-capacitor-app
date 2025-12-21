// navbar-gesture.js — swipe navigation for dashboard pages
let startX = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;

  const pages = ["home.html", "history.html", "analysis.html", "profile.html"];
  const current = pages.indexOf(
    location.pathname.split("/").pop()
  );

  if (diff < -80 && current < pages.length - 1) {
    location.href = pages[current + 1];
  }
  if (diff > 80 && current > 0) {
    location.href = pages[current - 1];
  }
});
