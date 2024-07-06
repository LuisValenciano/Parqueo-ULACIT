function saveUserSession(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

function getUserSession() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

window.saveUserSession = saveUserSession;
window.getUserSession = getUserSession;
