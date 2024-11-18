// URL base de tu API de autenticación
const API_URL = 'http://161.132.56.70:3001/api/auth';

const authService = {
  // Iniciar sesión
  loginUser: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Error iniciando sesión');

      return await response.json();
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      throw error;
    }
  },

  // Registrar un nuevo usuario
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Error registrando el usuario');

      return await response.json();
    } catch (error) {
      console.error('Error registrando el usuario:', error);
      throw error;
    }
  },
};

export default authService;
