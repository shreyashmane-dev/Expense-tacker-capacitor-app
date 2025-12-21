function login() {
  localStorage.setItem("user", JSON.stringify({ loggedIn: true }));
  location.href = "../dashboard/home.html";
}

function signup() {
  // simple signup fallback — store user and redirect
  localStorage.setItem("user", JSON.stringify({ loggedIn: true }));
  location.href = "../dashboard/home.html";
}

window.login = login;
window.signup = signup;
