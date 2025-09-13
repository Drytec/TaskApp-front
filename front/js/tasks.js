// tasks.js - Versión simulada para pruebas

// Simulación de tareas
let mockTasks = [
    { id: '1', taskName: 'Completar proyecto', taskDescription: 'Finalizar el proyecto integrador', isComplete: false, isImportant: true, createdAt: new Date().toISOString() },
    { id: '2', taskName: 'Estudiar para examen', taskDescription: 'Repasar material del curso', isComplete: false, isImportant: false, createdAt: new Date().toISOString() },
    { id: '3', taskName: 'Hacer ejercicio', taskDescription: '30 minutos de cardio', isComplete: true, isImportant: false, createdAt: new Date().toISOString() }
];

// Función para simular respuesta del backend
async function simulateResponse(success = true, data = {}, delay = 500) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (success) {
                resolve({ success: true, data });
            } else {
                resolve({ success: false, error: 'Error simulado para pruebas' });
            }
        }, delay);
    });
}

// Función para crear una tarea
async function createTask(taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        // Crear nueva tarea simulada
        const newTask = {
            id: Date.now().toString(),
            taskName: taskData.taskName,
            taskDescription: taskData.taskDescription || '',
            isImportant: taskData.isImportant || false,
            isComplete: false,
            createdAt: new Date().toISOString(),
            dueDate: taskData.dueDate || null,
            dueTime: taskData.dueTime || null,
            status: taskData.status || 'Por hacer'
        };

        // Agregar a la lista simulada
        mockTasks.push(newTask);

        return await simulateResponse(true, newTask);
    } catch (error) {
        console.error('Error creando tarea:', error);
        return { success: false, error: error.message };
    }
}

// Función para obtener todas las tareas
async function getAllTasks() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        return await simulateResponse(true, mockTasks);
    } catch (error) {
        console.error('Error obteniendo tareas:', error);
        return { success: false, error: error.message };
    }
}

// Función para obtener una tarea por ID
async function getTaskById(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const task = mockTasks.find(t => t.id === taskId);
        if (!task) {
            return { success: false, error: 'Tarea no encontrada' };
        }

        return await simulateResponse(true, task);
    } catch (error) {
        console.error('Error obteniendo tarea:', error);
        return { success: false, error: error.message };
    }
}

// Función para actualizar una tarea
async function updateTask(taskId, taskData) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return { success: false, error: 'Tarea no encontrada' };
        }

        // Actualizar tarea
        mockTasks[taskIndex] = {
            ...mockTasks[taskIndex],
            ...taskData,
            id: taskId // Asegurar que el ID no cambie
        };

        return await simulateResponse(true, mockTasks[taskIndex]);
    } catch (error) {
        console.error('Error actualizando tarea:', error);
        return { success: false, error: error.message };
    }
}

// Función para eliminar una tarea
async function deleteTask(taskId) {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('No autenticado');
        }

        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) {
            return { success: false, error: 'Tarea no encontrada' };
        }

        // Eliminar tarea
        mockTasks.splice(taskIndex, 1);

        return await simulateResponse(true, { message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error eliminando tarea:', error);
        return { success: false, error: error.message };
    }
}