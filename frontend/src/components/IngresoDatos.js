// components/IngresoDatos.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';

const IngresoDatos = () => {
  const [nivel, setNivel] = useState('');
  const [generadorId, setGeneradorId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/consumos/', {
        nivel_actual: nivel,
        generador: generadorId
      });

      alert('✅ Datos guardados correctamente');
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      alert('❌ Error al guardar los datos');
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom>
        Ingreso Manual de Datos
      </Typography>

      <TextField
        label="Nivel actual de combustible (L)"
        type="number"
        fullWidth
        margin="normal"
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
        required
        inputProps={{ min: "0", step: "any" }}
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