import { auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, user => {
  if (!user) location.href = "/auth/login.html";
});
