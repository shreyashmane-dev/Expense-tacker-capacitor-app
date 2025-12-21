// SMS Permission Handler for Android
const btn = document.getElementById("requestSmsBtn");
const toggle = document.getElementById("smsToggle");

// Load saved state from localStorage
if (toggle) {
  toggle.checked = localStorage.getItem("smsEnabled") === "true";
}

// Request SMS permissions (Android only)
btn?.addEventListener("click", async () => {
  // Check if running in Capacitor (Android app)
  if (!window.Capacitor) {
    alert("SMS tracking works only in the Android app. On web, use the SMS Simulator on the Home page for testing.");
    return;
  }

  try {
    // Request SMS permissions via Capacitor
    const result = await Capacitor.Plugins.Permissions.requestPermissions({
      permissions: ["receiveSms", "readSms"]
    });

    if (result.receiveSms === "granted" && result.readSms === "granted") {
      localStorage.setItem("smsEnabled", "true");
      if (toggle) toggle.checked = true;
      alert("✅ SMS tracking enabled! Transactions will be added automatically.");
    } else {
      alert("❌ SMS permissions denied. Please enable them in Settings.");
    }
  } catch (error) {
    console.error("Permission request failed:", error);
    alert("Failed to request permissions. Please try again.");
  }
});

// Toggle SMS tracking on/off
toggle?.addEventListener("change", () => {
  const enabled = toggle.checked;
  localStorage.setItem("smsEnabled", enabled.toString());
  
  if (enabled) {
    console.log("SMS tracking enabled");
  } else {
    console.log("SMS tracking disabled");
  }
});
