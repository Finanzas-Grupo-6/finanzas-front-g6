// URL base de tu API
const API_URL = 'http://161.132.56.70:3001/api/carteras';

const carteraService = {
  // Crear una nueva cartera
  createCartera: async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear la cartera');
      return await response.json();
    } catch (error) {
      console.error('Error creando la cartera:', error);
      throw error;
    }
  },

  // Obtener todas las carteras con sus facturas
  getCarteras: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error obteniendo las carteras');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo las carteras:', error);
      throw error;
    }
  },

  // Obtener una cartera por ID
  getCarteraById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error obteniendo la cartera por ID');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo la cartera por ID:', error);
      throw error;
    }
  },

  // Actualizar una cartera
  updateCartera: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error actualizando la cartera');
      return await response.json();
    } catch (error) {
      console.error('Error actualizando la cartera:', error);
      throw error;
    }
  },

  // Eliminar una cartera
  deleteCartera: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error eliminando la cartera');
      return await response.json();
    } catch (error) {
      console.error('Error eliminando la cartera:', error);
      throw error;
    }
  },

  // Calcular el monto a recibir hoy
  calcularMontoRecibirHoy: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/recibir-hoy`);
      if (!response.ok) throw new Error('Error calculando el monto a recibir hoy');
      return await response.json();
    } catch (error) {
      console.error('Error calculando el monto a recibir hoy:', error);
      throw error;
    }
  },

  // Recibir saldo y actualizar la cartera
  recibirSaldoYActualizarCartera: async (userId, carteraId) => {
    try {
      const response = await fetch(`${API_URL}/recibir-saldo/${userId}/${carteraId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error recibiendo saldo y actualizando la cartera');
      return await response.json();
    } catch (error) {
      console.error('Error recibiendo saldo y actualizando la cartera:', error);
      throw error;
    }
  },

  // Obtener monto total de facturas por mes
  getMontoTotalPorMes: async () => {
    try {
      const response = await fetch(`${API_URL}/monto-por-mes`);
      if (!response.ok) throw new Error('Error obteniendo monto total por mes');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo monto total por mes:', error);
      throw error;
    }
  },

  // Obtener todas las carteras con sus montos totales
  getCarterasConMontos: async () => {
    try {
      const response = await fetch(`${API_URL}/montos`);
      if (!response.ok) throw new Error('Error obteniendo carteras con montos');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo carteras con montos:', error);
      throw error;
    }
  }
};

export default carteraService;
