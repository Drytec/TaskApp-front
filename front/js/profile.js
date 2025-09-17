// Abrir formulario con los datos actuales
function openEditForm() {
    document.getElementById('editName').value = document.getElementById('userFirstName').textContent;
    document.getElementById('editLastname').value = document.getElementById('userLastName').textContent;
    document.getElementById('editAge').value = document.getElementById('userAge').textContent !== "No disponible"
        ? document.getElementById('userAge').textContent : "";
    document.getElementById('editPassword').value = "";

    document.getElementById('editUserModal').style.display = "block";
}

function closeEditForm() {
    document.getElementById('editUserModal').style.display = "none";
}

document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert("No estás autenticado");
        return;
    }

    try {
        const responseMe = await fetch(`${API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await responseMe.json();

        const updates = {
            name: document.getElementById('editName').value,
            lastname: document.getElementById('editLastname').value,
            age: document.getElementById('editAge').value,
        };

        const newPassword = document.getElementById('editPassword').value;
        if (newPassword) {
            updates.password = newPassword;
        }

        const response = await fetch(`${API_URL}/users/${user._id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error al actualizar usuario");
        }

        alert("Usuario actualizado correctamente");
        closeEditForm();
        loadUserInfo(); // recargar datos
    } catch (err) {
        alert("Error: " + err.message);
    }
});
