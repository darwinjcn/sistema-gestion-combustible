// components/AlertaSimulada.js
import React from 'react';
import { Alert } from '@mui/material';

const AlertaSimulada = () => {
  const nivelBajo = true; // Simular condición

  return (
    <>
      {nivelBajo && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          ⚠️ El nivel de combustible está por debajo del umbral seguro.
        </Alert>
      )}
    </>
  );
};

export default AlertaSimulada;