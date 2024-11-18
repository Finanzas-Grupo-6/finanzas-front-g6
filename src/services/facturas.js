// URL base de tu API
const API_URL = 'http://161.132.56.70:3001/api/facturas';

const facturaService = {
  // Crear una nueva factura
  createFactura: async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear la factura');
      return await response.json();
    } catch (error) {
      console.error('Error al crear la factura:', error);
      throw error;
    }
  },

  // Obtener todas las facturas
  getFacturas: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener las facturas');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener las facturas:', error);
      throw error;
    }
  },

  // Obtener una factura por ID
  getFacturaById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener la factura por ID');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener la factura por ID:', error);
      throw error;
    }
  },

  // Obtener facturas agrupadas por mes
  getFacturasPorMes: async () => {
    try {
      const response = await fetch('http://161.132.56.70:3001/api/facturas/a/por-mes/a');
      if (!response.ok) throw new Error('Error al obtener las facturas por mes');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener las facturas por mes:', error);
      throw error;
    }
  },

  // Actualizar una factura
  updateFactura: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar la factura');
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar la factura:', error);
      throw error;
    }
  },

  // Eliminar una factura
  deleteFactura: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar la factura');
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
      throw error;
    }
  },
};

export default facturaService;
