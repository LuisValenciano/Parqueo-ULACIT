// Functions to get data from session
function getUsernameFromSession() {
  return sessionStorage.getItem("username");
}

function getCurrentPasswordFromSession() {
  return sessionStorage.getItem("currentPassword");
}

function getIdUsuarioFromSession() {
  return sessionStorage.getItem("idUsuario");
}

document.addEventListener("DOMContentLoaded", function () {
  const changePasswordButton = document.getElementById("change-password-button");

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", async (e) => {
      e.preventDefault();

      // Getting user input
      const newPassword = document.getElementById("new-password").value;
      const username = getUsernameFromSession();
      const currentPassword = getCurrentPasswordFromSession();
      const idUsuario = getIdUsuarioFromSession();

      console.log("Retrieved idUsuario:", idUsuario);  // Debugging 

      // Password validation
      if (newPassword === "Ulacit123") {
        alert("La nueva contraseña no puede ser la default del sistema.");
        console.log("La nueva contraseña no puede ser la default del sistema.");
        return;
      }

      if (newPassword.length < 8) {
        alert("La nueva contraseña debe tener al menos 8 caracteres.");
        console.log("La nueva contraseña debe tener al menos 8 caracteres.");
        return;
      }

      if (!idUsuario) {
        alert("Error: idUsuario is null or undefined.");
        console.error("idUsuario is null or undefined.");
        return;
      }

      try {
        console.log("Fetching user data...");  // Debugging 
        // Fetch the user from the Usuario table using idUsuario
        const { data: userData, error: userError } = await window.supabase
          .from("Usuario")
          .select("*")
          .eq("idUsuario", idUsuario)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
          alert(`Error: ${userError.message}`);
          return;
        }

        if (!userData) {
          console.log("No user found with that ID");
          alert("Usuario no encontrado.");
          return;
        }

        console.log("User data fetched:", userData);

        console.log("Comparing current password...");  // Debugging
        // Check if current password matches
        const currentPasswordMatches = currentPassword === userData.password;

        console.log("currentPasswordMatches:", currentPasswordMatches);  // Debugging

        if (!currentPasswordMatches) {
          console.log("Current password does not match");
          alert("La contraseña actual es incorrecta.");
          return;
        }

        console.log("Comparing new password...");  // Debugging 
        // Check if the new password is different from the current password
        const newPasswordMatches = newPassword === userData.password;

        console.log("newPasswordMatches:", newPasswordMatches);  // Debugging

        if (newPasswordMatches) {
          console.log("New password is the same as the current password");
          alert("La nueva contraseña no puede ser igual a la contraseña actual.");
          return;
        }

        console.log("Updating password in database...");  // Debugging
        // Update the user's password in the Usuario table
        const { error: updateError } = await window.supabase
          .from("Usuario")
          .update({ password: newPassword })
          .eq("idUsuario", idUsuario);

        if (updateError) {
          console.error("Error updating password:", updateError);
          alert(`Error actualizando la contraseña: ${updateError.message}`);
          return;
        }

        alert("Contraseña cambiada exitosamente.");
        window.location.href = "/views/index.html";
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        console.log("Error stack trace:", err.stack);  // Debugging
        alert("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
      }
    });
  }
});

