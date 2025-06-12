// components/IngresoDatos.js

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert
} from '@mui/material';
import axios from 'axios';

const IngresoDatos = () => {
  const [nivel, setNivel] = useState('');
  const [generadorId, setGeneradorId] = useState('');
  const [consumo, setConsumo] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(false);

    if (!nivel || !generadorId || !consumo) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await axios.post('/api/consumos/', {
        nivel_actual: parseFloat(nivel),
        consumo: parseFloat(consumo),
        generador: parseInt(generadorId)
      });

      console.log('Datos guardados:', response.data);
      setExito(true);
    } catch (err) {
      console.error('Error al guardar los datos:', err.response?.data || err.message);
      setError(err.response?.data || "Error desconocido al guardar los datos.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Ingreso Manual de Datos
      </Typography>

      {/* Mensaje de éxito */}
      {exito && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ Datos guardados correctamente.
        </Alert>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      {/* ID del Generador */}
      <TextField
        label="ID del Generador"
        type="number"
        fullWidth
        margin="normal"
        value={generadorId}
        onChange={(e) => setGeneradorId(e.target.value)}
        required
        inputProps={{ min: "1", step: "1" }}
        helperText="Introduce un ID válido de un generador existente"
      />

      {/* Nivel Actual */}
      <TextField
        label="Nivel actual de combustible (L)"
        type="number"
        fullWidth
        margin="normal"
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
        required
        inputProps={{ min: "0", step: "any" }}
        helperText="Ejemplo: 750.50"
      />

      {/* Consumo */}
      <TextField
        label="Consumo de combustible (L)"
        type="number"
        fullWidth
        margin="normal"
        value={consumo}
        onChange={(e) => setConsumo(e.target.value)}
        required
        inputProps={{ min: "0", step: "any" }}
        helperText="Ejemplo: 50.25"
      />

      {/* Botón Guardar */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullWidth
        sx={{ mt: 2 }}
      >
        Guardar Datos
      </Button>
    </Box>
  );
};

export default IngresoDatos;