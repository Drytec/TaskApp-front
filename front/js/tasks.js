// tasks.js

// Function to create a task

function validateTask(taskData) {
    if (!taskData.taskName || taskData.taskName.trim() === "") {
        return "⚠️ El título es obligatorio";
    }
    if (taskData.taskName.length > 50) {
        return "⚠️ El título no puede superar 50 caracteres";
    }
    if (taskData.taskDescription && taskData.taskDescription.length > 300) {
        return "⚠️ La descripción no puede superar 300 caracteres";
    }
    if (!["Por hacer", "Haciendo", "Hecho"].includes(taskData.status)) {
        return "⚠️ Estado inválido";
    }
    return null; // ✅ sin errores
}

async function createTask(taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                taskName: taskData.taskName,
                taskDescription: taskData.taskDescription || '',
                isImportant: taskData.isImportant || false,
                dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : null,
                dueTime: taskData.dueTime || null,
                status: taskData.status || 'Por hacer'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error creating task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to get all tasks
async function getAllTasks() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error getting tasks');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to update a task
async function updateTask(taskId, updateData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ...updateData,
                
                dueDate: updateData.dueDate ? updateData.dueDate.split("T")[0] : null
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error updating task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to delete a task
async function deleteTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error deleting task');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Function to get a specific task
async function getTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error getting task');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

console.log('Tasks.js loaded successfully');


window.createTask = createTask;
window.getAllTasks = getAllTasks;
window.updateTask = updateTask;
window.deleteTask = deleteTask;
window.getTask = getTask;
window.validateTask = validateTask; 