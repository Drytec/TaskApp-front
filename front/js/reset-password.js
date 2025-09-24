import { showModal } from "./auth.js";  


const API_URL =
  window.location.hostname.includes("localhost")
    ? "/api"  
    : "https://taskapp-aaph.onrender.com/api";


document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const form = document.getElementById("resetForm");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const errorBox = document.getElementById("confirm-error");
  const submitBtn = document.getElementById("submitBtn");
  const tokenError = document.getElementById("tokenError");

  if (!token) {
    tokenError.style.display = "block";
    form.style.display = "none";
    return;
  }

  // 🔹 Validación dinámica de password
  newPasswordInput.addEventListener("input", () => {
    const value = newPasswordInput.value;

    // Regex como en backend: min 8 chars, mayus, minus, número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (passwordRegex.test(value)) {
      newPasswordInput.classList.remove("error");
      newPasswordInput.classList.add("valid");
    } else {
      newPasswordInput.classList.remove("valid");
      newPasswordInput.classList.add("error");
    }
  });

  // 🔹 Confirmación de password
  confirmPasswordInput.addEventListener("input", () => {
    if (
      confirmPasswordInput.value === newPasswordInput.value &&
      confirmPasswordInput.value.length > 0
    ) {
      confirmPasswordInput.classList.remove("error");
      confirmPasswordInput.classList.add("valid");
      errorBox.innerText = "";
    } else {
      confirmPasswordInput.classList.remove("valid");
      confirmPasswordInput.classList.add("error");
      errorBox.innerText = "Las contraseñas no coinciden";
    }
  });

  // 🔹 Form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showModal(
          "✅ Contraseña actualizada correctamente. Ahora puedes iniciar sesión.",
          "success",
          false,
          () => {
            window.location.href = "/login.html";
          }
        );
      } else {
        showModal(data.error || "No se pudo cambiar la contraseña", "error");
      }
    } catch (err) {
      console.error(err);
      showModal("❌ Error de conexión con el servidor", "error");
    }
  });
});
