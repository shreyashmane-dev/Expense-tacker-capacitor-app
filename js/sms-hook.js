// sms-hook.js — web fallback for injected SMS/notification data
window.onSMSReceived = function (data) {
  // data expected: { amount, type, category, source }
  import("./storage.js").then(({ saveTxn }) => {
    saveTxn({
      id: Date.now(),
      amount: data.amount,
      type: data.type,
      category: data.category,
      source: "sms",
      date: new Date().toISOString().split("T")[0]
    });
  }).catch(() => {});
};
