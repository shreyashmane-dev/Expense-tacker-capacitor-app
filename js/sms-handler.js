import { addTransaction } from "./db.js";

// ===============================
// ANDROID SMS EVENT LISTENER
// ===============================
window.addEventListener("smsReceived", (e) => {
  // Check if SMS tracking is enabled
  const enabled = localStorage.getItem("smsEnabled") === "true";
  if (!enabled) {
    console.log("SMS tracking is disabled");
    return;
  }

  try {
    const data = JSON.parse(e.detail);
    const txn = parseSMS(data.text);
    
    if (txn && txn.amount > 0) {
      addTransaction(txn);
      console.log("Transaction added from SMS:", txn);
      
      // Trigger UI refresh
      window.dispatchEvent(new Event("transactionAdded"));
    }
  } catch (err) {
    console.error("SMS parse error:", err);
  }
});

// ===============================
// SMS PARSING LOGIC
// ===============================

export function parseSMS(text) {
  text = text.toLowerCase();

  // Smart category detection
  let category = "Other";

  if (text.includes("swiggy") || text.includes("zomato") || text.includes("food") || text.includes("restaurant"))
    category = "Food";
  else if (text.includes("uber") || text.includes("ola") || text.includes("rapido") || text.includes("taxi"))
    category = "Travel";
  else if (text.includes("electricity") || text.includes("bill") || text.includes("water") || text.includes("gas"))
    category = "Bills";
  else if (text.includes("amazon") || text.includes("flipkart") || text.includes("shopping") || text.includes("myntra"))
    category = "Shopping";
  else if (text.includes("salary") || text.includes("credited") || text.includes("deposit"))
    category = "Salary";

  // Extract amount (find first number in the text)
  const amountMatch = text.match(/(?:rs\.?|₹)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0;

  // Determine transaction type
  let type = "expense";
  if (text.includes("credited") || text.includes("received") || text.includes("salary")) {
    type = "income";
  }

  // Extract payment mode
  let paymentMode = "UPI";
  if (text.includes("gpay") || text.includes("google pay"))
    paymentMode = "GPay";
  else if (text.includes("phonepe") || text.includes("phone pe"))
    paymentMode = "PhonePe";
  else if (text.includes("paytm"))
    paymentMode = "Paytm";
  else if (text.includes("cash"))
    paymentMode = "Cash";
  else if (text.includes("card") || text.includes("debit") || text.includes("credit"))
    paymentMode = "Bank";

  return {
    amount,
    type,
    category,
    paymentMode,
    source: "sms",
    date: new Date().toLocaleDateString()
  };
}

// Add SMS transaction to local storage
export function addSmsTransaction(smsText) {
  const txn = parseSMS(smsText);
  if (txn && txn.amount > 0) {
    addTransaction(txn);
    return true;
  }
  return false;
}
