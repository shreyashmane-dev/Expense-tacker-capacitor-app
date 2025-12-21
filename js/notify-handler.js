import { addTransaction } from './transactions.js';

export function parsePaymentNotification(text) {
  const amountMatch = text.match(/₹\s?([\d,]+(?:\.\d{1,2})?)/);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0;
  const isDebit = /paid|sent|debited|paid to|paid via/i.test(text);
  const isCredit = /received|credited|deposit|credited to/i.test(text);

  const paymentMode = /phonepe/i.test(text) ? 'PhonePe' : (/gpay|google pay|tez/i.test(text) ? 'GPay' : 'UPI');

  return {
    amount: amount || 0,
    type: isDebit ? 'expense' : (isCredit ? 'income' : 'expense'),
    paymentMode: paymentMode,
    category: 'UPI',
    source: 'notification',
    date: new Date().toLocaleDateString(),
    raw: text
  };
}

// Listen for events dispatched by native Android
window.addEventListener('notificationReceived', (e) => {
  try {
    const payload = typeof e.detail === 'string' ? JSON.parse(e.detail) : e.detail;
    const text = payload && payload.text ? payload.text : '';
    const txn = parsePaymentNotification(text);
    if (txn && txn.amount > 0) {
      addTransaction(txn);
      window.dispatchEvent(new Event('transactionAdded'));
      console.log('Transaction added from notification:', txn);
    }
  } catch (err) {
    console.error('notification handler error', err);
  }
});

export function addNotificationTransaction(text) {
  const txn = parsePaymentNotification(text);
  if (txn && txn.amount > 0) {
    addTransaction(txn);
    window.dispatchEvent(new Event('transactionAdded'));
    return true;
  }
  return false;
}
