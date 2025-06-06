// components/IngresoDatos.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const IngresoDatos = () => {
  const [nivel, setNivel] = useState('');
  const [generadorId, setGeneradorId] = useState('');

  const handleSubmit = () => {
    // Aquí iría la llamada a la API cuando esté lista
    alert(`Datos guardados:\nNivel actual: ${nivel}L\nID Generador: ${generadorId}`);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label="Nivel actual de combustible (L)"
        type="number"
        fullWidth
        margin="normal"
        value={nivel}
        onChange={(e) => setNivel(e.target.value)}
      />
      <TextField
        label="ID del Generador"
        type="number"
        fullWidth
        margin="normal"
        value={generadorId}
        onChange={(e) => setGeneradorId(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 2 }}
      >
        Guardar Datos
      </Button>
    </Box>
  );
};

export default IngresoDatos;