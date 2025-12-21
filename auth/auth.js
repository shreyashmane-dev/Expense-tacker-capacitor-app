import { auth, db } from "../js/firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// ... (Signup logic remains the same, assuming it's above)

const loginForm = document.getElementById("login-form");
console.log("Login Form:", loginForm);

if(loginForm){
  loginForm.addEventListener("submit", async (e)=>{
    console.log("Login submit clicked");
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const btn = loginForm.querySelector("button");
    const originalText = btn.textContent;

    try {
      if (!navigator.onLine) {
        throw new Error("You are offline. Internet required for login.");
      }
      btn.textContent = "Logging in...";
      btn.disabled = true;

      // Force persistence to LOCAL (survives close/refresh)
      await setPersistence(auth, browserLocalPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Successful:", userCredential.user.email);
      
      alert("Login Success! Redirecting...");
      window.location.href = "/dashboard/home.html";
    } catch(err){
      console.error("Login Error:", err);
      alert("Login Failed: " + err.message);
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
