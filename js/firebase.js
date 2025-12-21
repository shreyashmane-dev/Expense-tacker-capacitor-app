import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgRMz1Fr7eH_HMVaHn7_oJ6m9kErchr_Q",
  authDomain: "studio-7722428722-420d6.firebaseapp.com",
  projectId: "studio-7722428722-420d6",
  appId: "1:313652588619:web:6396d24bb31d84ccacddce"
};

if (!firebaseConfig.apiKey) {
  console.error("CRITICAL: Firebase Config is missing. Check .env file.");
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { onAuthStateChanged, setPersistence, browserLocalPersistence };

// Enable persistence globally
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Persistence persistence error", error);
});

console.log("Firebase Initialized (CDN)");
