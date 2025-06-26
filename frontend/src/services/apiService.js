// services/apiService.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/',
  timeout: 10000,
});

export const getGeneradores = async () => {
  try {
    const res = await apiClient.get('/generadores/');
    return res.data;
  } catch (err) {
    console.error("Error obteniendo generadores:", err);
    return [];
  }
};

export const getConsumosPorGenerador = async (generadorId) => {
  try {
    const res = await apiClient.get(`/consumos/?generador=${generadorId}`);
    return res.data;
  } catch (err) {
    console.error(`Error obteniendo consumos para el generador ${generadorId}:`, err);
    return [];
  }
};

export const guardarConsumo = async (data) => {
  try {
    const res = await apiClient.post('/consumos/', data);
    return res.data;
  } catch (err) {
    console.error("Error guardando consumo:", err.response?.data || err.message);
    throw err;
  }
};