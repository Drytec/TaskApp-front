const API_URL =
  window.location.hostname.includes("localhost")
    ? "/api"
    : "https://taskapp-aaph.onrender.com/api";

function saveToken(token) {
  localStorage.setItem("authToken", token);
}

function getToken() {
  return localStorage.getItem("authToken");
}

function removeToken() {
  localStorage.removeItem("authToken");
}

function isAuthenticated() {
  return !!getToken();
}

async function checkAuth() {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const user = await response.json();

      // guardar userId sin importar la forma de la respuesta
      const userId = user?.user?._id || user?._id;
      if (userId) {
        localStorage.setItem("userId", userId);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verificando autenticación:", error);
    return false;
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    saveToken(data.token);

    // guardar el userId de forma segura
    const userId = data?.user?._id || data?._id;
    if (userId) {
      localStorage.setItem("userId", userId);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function signup(userData) {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al registrar usuario");
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function logout() {
  removeToken();
  localStorage.removeItem("userId"); // limpiar también el userId
  window.location.href = "/login";
}

async function updateUser(updates) {
  const token = getToken();
  const userId = localStorage.getItem("userId");

  if (!token || !userId) {
    throw new Error("No hay sesión activa");
  }

  // nunca permitir modificar el email desde aquí
  if ("email" in updates) {
    delete updates.email;
  }

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al actualizar usuario");
  }

  return data;
}

async function deleteAccount() {
    const token = getToken();
    if (!token) {
        return { success: false, error: "No estás autenticado" };
    }

    try {
        const meResponse = await fetch(`${API_URL}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!meResponse.ok) {
            throw new Error("No se pudo obtener el usuario actual");
        }

        const meData = await meResponse.json();
        const userId = meData._id;

        const deleteResponse = await fetch(`${API_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await deleteResponse.json();

        if (!deleteResponse.ok) {
            throw new Error(result.error || "Error al eliminar cuenta");
        }

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export function showModal(message, type = "info", showCancel = false, onConfirm = null) {
    console.log("✅ showModal ejecutado con mensaje:", message);
    const modal = document.getElementById("feedbackModal");
    const modalBox = document.getElementById("modalContent");
    const modalMessage = document.getElementById("modalMessage");
    const modalButtons = document.getElementById("modalButtons");

    // Reiniciar clases de modalBox para que se apliquen estilos según el tipo
    modalBox.className = `modal-box ${type}`;

    modalMessage.textContent = message;
    modalButtons.innerHTML = "";

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.onclick = () => {
        modal.style.display = "none";
        if (onConfirm) onConfirm();
    };

    modalButtons.appendChild(okButton);

    if (showCancel) {
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancelar";
        cancelButton.onclick = () => {
            modal.style.display = "none";
        };
        modalButtons.appendChild(cancelButton);
    }

    modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("feedbackModal");
  if (modal) {
    modal.style.display = "none";
  }
}
