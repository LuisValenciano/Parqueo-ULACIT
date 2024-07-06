document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", async (e) => {
      e.preventDefault();

      // getting user input
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // signIn into the db
      try {
        const { data, error } = await window.supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        // handling errors
        if (error) {
          alert(`login failed ${error.message}`);
        } else {
          window.saveUserSession(data.user);
          //checking if password change needed
          if (password === "Ulacit123") {
            alert("Debe de cambiar su contraseña");
            window.location.href = "/views/PasswordRecovery.html";
          } else {
            alert(`Login successful`);
            window.location.href = "/views/HomePage.html";
          }
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
      }
    });
  }
});
