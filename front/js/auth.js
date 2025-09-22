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
