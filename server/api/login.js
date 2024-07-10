// Declare a global variable
var globalIdUsuario;

document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", async (e) => {
      e.preventDefault();

      // Getting user input
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      console.log("Username:", username);
      console.log("Password:", password);

      try {
        // Fetch the user from the Usuario table using the email 
        const { data: userData, error: userError, status } = await window.supabase
          .from("Usuario")
          .select("*")
          .eq("email", username)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          alert(`Login failed: ${userError.message}`);
          return;
        }

        if (!userData) {
          console.log("No user found with that email");
          alert("Login failed: Invalid credentials");
          return;
        }

        console.log("User data fetched:", userData);

        // Check if the password matches
        const passwordMatches = userData.password === password;

        if (!passwordMatches) {
          console.log("Password does not match");
          alert("Login failed: Invalid credentials");
          return;
        }

        console.log("Password matches");

        // check if the password is "Ulacit123"
        if (password === "Ulacit123") {
          alert("Debe de cambiar su contraseña");
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("currentPassword", password);
          sessionStorage.setItem("idUsuario", userData.idUsuario);  // saves idUsuario
          globalIdUsuario = userData.idUsuario;  // global variable
          console.log("Stored idUsuario:", userData.idUsuario);
          window.location.href = "/views/PasswordChange.html";
        } else {
          alert("Login successful");
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("currentPassword", password);
          sessionStorage.setItem("idUsuario", userData.idUsuario);  // make sure idUsuario is stored correctly
          globalIdUsuario = userData.idUsuario;  // Set global variable
          console.log("Stored idUsuario:", userData.idUsuario);
          window.saveUserSession(userData);

          // Redirect based on role
          switch (userData.idRol) {
            case 1:
              window.location.href = "/views/Estudiante/estudiantes.html";
              break;
            case 2:
              window.location.href = "/views/Administrativo/landingPageAdministrativo.html";
              break;
            case 3:
              window.location.href = "/views/Guarda/oficialParqueo.html";
              break;
            case 4:
              window.location.href = "/views/Administrador/menuAdministrador.html";
              break;
            default:
              alert("Rol desconocido. Por favor, contacte al administrador.");
              break;
          }
        }
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        alert("An unexpected error occurred. Please try again.");
      }
    });
  }
});





