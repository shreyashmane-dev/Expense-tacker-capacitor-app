import { deleteTransaction } from "./db.js";

let startX = 0;
let startY = 0;

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  
  const deltaX = startX - endX;
  const deltaY = Math.abs(startY - endY);
  
  // Only trigger if horizontal swipe is dominant (not vertical scroll)
  if (deltaX > 80 && deltaY < 50) {
    const txn = e.target.closest(".txn");
      if (txn && txn.dataset.id) {
      if (confirm("Delete this transaction?")) {
        deleteTransaction(+txn.dataset.id);
        location.reload();
      }
    }
  }
}, { passive: true });
