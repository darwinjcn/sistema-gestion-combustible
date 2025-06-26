// components/AlertaReal.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from '@mui/material';

const UMBRAL_NIVEL_BAJO = 150;

const AlertaReal = () => {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const checkNivelesBajos = async () => {
      try {
        const res = await axios.get('/api/generadores/');
        const generadores = res.data;

        const nuevasAlertas = [];

        for (let gen of generadores) {
          if (gen.estado === 'activo' && gen.nivel_actual < UMBRAL_NIVEL_BAJO) {
            nuevasAlertas.push({
              id: gen.id,
              mensaje: `⚠️ Nivel bajo en el generador ${gen.modelo} (ID: ${gen.id}): solo ${gen.nivel_actual} L restantes.`,
              tipo: 'warning'
            });
          }
        }

        setAlertas(nuevasAlertas);
      } catch (err) {
        console.error("No se pudieron verificar niveles:", err);
        setAlertas([
          {
            id: -1,
            mensaje: "❌ Error: No se pudo conectar con la API.",
            tipo: 'error'
          }
        ]);
      }
    };

    checkNivelesBajos();
    const interval = setInterval(checkNivelesBajos, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginBottom: '20px' }}>
      {alertas.length > 0 ? (
        alertas.map((alerta, index) => (
          <Alert key={index} severity={alerta.tipo}>
            {alerta.mensaje}
          </Alert>
        ))
      ) : (
        <p>No hay alertas activas.</p>
      )}
    </div>
  );
};

export default AlertaReal;