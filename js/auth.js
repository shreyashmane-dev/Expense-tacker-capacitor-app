import { auth, db } from "./firebase.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function window_login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged in app.js will handle the redirect
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
}

export async function window_signup(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile
        await updateProfile(user, { displayName: name });

        // Initialize user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
            displayName: name,
            email: email,
            role: "Regular",
            createdAt: new Date().toISOString()
        });

        // onAuthStateChanged in app.js will handle the redirect
    } catch (error) {
        console.error("Signup failed:", error);
        alert("Signup failed: " + error.message);
    }
}
