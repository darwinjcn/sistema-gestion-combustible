// components/IngresoDatos.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

const IngresoDatos = () => {
  const [nivel, setNivel] = useState('');
  const [generadorId, setGeneradorId] = useState('');
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(false);

    if (!nivel || !generadorId) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await axios.post('/api/consumos/', {
        nivel_actual: parseFloat(nivel),
        generador: parseInt(generadorId)
      });

      console.log('Datos guardados:', response.data);
      setExito(true);
    } catch (err) {
      console.error('Error al guardar los datos:', err.response?.data || err.message);
      setError(`❌ Error al guardar los datos: ${err.message}`);
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
          {error}
        </Alert>
      )}

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

      <TextField
        label="ID del Generador"
        type="number"
        fullWidth
        margin="normal"
        value={generadorId}
        onChange={(e) => setGeneradorId(e.target.value)}
        required
        inputProps={{ min: "1" }}
        helperText="Introduce el ID del generador"
      />

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