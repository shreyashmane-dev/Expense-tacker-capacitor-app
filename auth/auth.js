import { auth, db } from "../js/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

/* LOGIN */
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const btn = document.getElementById("loginBtn");

  if (btn) { btn.disabled = true; btn.textContent = "Signing in..."; }
  console.time("signin-duration");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.timeEnd("signin-duration");
    location.replace("/dashboard/home.html");
  } catch (e) {
    console.timeEnd("signin-duration");
    alert(e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Login"; }
  }
};

/* SIGNUP */
window.signup = async function () {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role") ? document.getElementById("role").value : "Student";
  const income = document.getElementById("income") ? document.getElementById("income").value : 0;
  const currency = document.getElementById("currency") ? document.getElementById("currency").value : "₹";
  const btn = document.getElementById("signupBtn");

  if (btn) { btn.disabled = true; btn.textContent = "Creating..."; }
  console.time("signup-duration");

  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      name,
      email,
      role,
      monthlyIncome: Number(income) || 0,
      currency,
      createdAt: new Date().toISOString(),
      smsEnabled: false
    });

    console.timeEnd("signup-duration");
    location.replace("/dashboard/home.html");
  } catch (e) {
    console.timeEnd("signup-duration");
    alert(e.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Signup"; }
  }
};

// Attach click handlers if buttons exist (prevents needing inline onclick)
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", (e) => { e.preventDefault(); window.login(); });

  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) signupBtn.addEventListener("click", (e) => { e.preventDefault(); window.signup(); });
});
