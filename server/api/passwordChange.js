document.addEventListener("DOMContentLoaded", function () {
  const changePasswordButton = document.getElementById(
    "change-password-button"
  );

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("new-password").value;

      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get("email");

      if (!email) {
        console.error("No email found in URL");
        alert("Invalid email. Please try again.");
        return;
      }

      try {
        const { data: userData, error: authError } =
          await window.supabase.auth.getUser();

        if (authError) {
          console.error("Failed to get authenticated user:", authError.message);
          alert(`Failed to get authenticated user: ${authError.message}`);
          return;
        }

        const userId = userData?.user?.id;

        if (!userId) {
          console.error("User ID not found in auth");
          alert("User ID not found. Please try again.");
          return;
        }

        const { error: passwordUpdateError } =
          await window.supabase.auth.updateUser({
            password: newPassword,
          });

        if (passwordUpdateError) {
          console.error(
            "Password change in auth failed:",
            passwordUpdateError.message
          );
          alert(
            `Password change in auth failed: ${passwordUpdateError.message}`
          );
          return;
        }

        const { error: profileError } = await window.supabase
          .from("Usuario")
          .update({
            password: newPassword,
          })
          .eq("id", userId);

        if (profileError) {
          console.error(
            "Password change in Usuario table failed:",
            profileError.message
          );
          alert(
            `Password change in Usuario table failed: ${profileError.message}`
          );
          return;
        }

        console.log("Password change successful");
        alert("Password change successful");
        window.location.href = "/views/HomePage.html";
      } catch (err) {
        console.error("An unexpected error occurred:", err);
        alert("An unexpected error occurred. Please try again later.");
      }
    });
  }
});
