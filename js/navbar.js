import { auth } from "./firebase.js";
import { signOut } from "firebase/auth";

// Logout logic
document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "logoutBtn") {
        try {
            await signOut(auth);
            location.replace("/auth/login.html");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
});

// Navbar active state highlighting
export function initNavbar() {
    const path = window.location.pathname;
    const page = path.split("/").pop().replace(".html", "") || "home";
    
    document.querySelectorAll(".nav-item").forEach(item => {
        const itemPage = item.getAttribute("href").split("/").pop().replace(".html", "");
        if (itemPage === page) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}
