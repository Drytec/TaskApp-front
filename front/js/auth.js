// Cambiado temporalmente para pruebas
// const API_URL = 'http://localhost:5100/api';
const API_URL = 'https://jsonplaceholder.typicode.com';

// Función simulada para registro y login mientras el backend está en desarrollo
async function simulateBackendResponse(success = true, data = {}, delay = 500) {
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


function saveToken(token) {
    localStorage.setItem('authToken', token);
}


function getToken() {
    return localStorage.getItem('authToken');
}


function removeToken() {
    localStorage.removeItem('authToken');
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
        // Simulación de verificación de token
        // Si hay un token, consideramos que el usuario está autenticado
        return true;
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}


async function login(email, password) {
    try {
        // Simulación de login exitoso
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZCI6IjEyMzQ1NiIsImlhdCI6MTYxNjE1MTYxNn0.hMWCQnQsYDLHAPiOxAqAOmfQfBPrxoWaIkPZUXXYGGE';
        
        // Simular verificación de credenciales
        if (email && password) {
            const result = await simulateBackendResponse(true, { token: mockToken });
            
            if (result.success) {
                saveToken(result.data.token);
            }
            
            return result;
        } else {
            return { success: false, error: 'Credenciales inválidas' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, error: error.message };
    }
}


async function signup(userData) {
    try {
        // Simulación de registro exitoso
        const mockData = { id: '123456', email: userData.email };
        
        // Simular verificación de datos
        if (userData.email && userData.password) {
            const result = await simulateBackendResponse(true, mockData);
            return result;
        } else {
            return { success: false, error: 'Datos de usuario incompletos' };
        }
    } catch (error) {
        console.error('Error en signup:', error);
        return { success: false, error: error.message };
    }
}


function logout() {
    removeToken();
    window.location.href = 'login.html';
}