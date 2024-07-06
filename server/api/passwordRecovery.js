document.addEventListener("DOMContentLoaded", function () {
  const recoverButton = document.getElementById("recover-button");

  if (recoverButton) {
    recoverButton.addEventListener("click", (e) => {
      e.preventDefault();

      // Obtener el email del usuario
      const email = document.getElementById("email").value;

      if (email) {
        console.log("Redirecting to PasswordChange with email:", email);
        window.location.href = `${
          window.location.origin
        }/views/PasswordChange.html?email=${encodeURIComponent(email)}`;
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }
});
