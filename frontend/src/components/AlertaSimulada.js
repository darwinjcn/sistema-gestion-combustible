// components/AlertaSimulada.js
import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import axios from 'axios';

const AlertaSimulada = () => {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    const checkNiveles = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/generadores/');
        const generadores = res.data;

        // Si algún generador tiene nivel bajo
        const hayNivelBajo = generadores.some(gen => gen.nivel_actual < 300 && gen.nivel_actual !== null);

        setMostrarAlerta(hayNivelBajo);
      } catch (error) {
        console.error("No se pudieron cargar los niveles:", error);
      }
    };

    checkNiveles();

    // Opcional: refrescar cada X segundos
    const interval = setInterval(checkNiveles, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {mostrarAlerta && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          ⚠️ El nivel de combustible está por debajo del umbral seguro.
        </Alert>
      )}
    </>
  );
};

export default AlertaSimulada;