// components/GraficoConsumo.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const GraficoConsumo = ({ generadorId }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await axios.get(`/api/consumos/?generador=${generadorId}`);
        const data = res.data.map(item => ({
          fecha: item.fecha.slice(0, 10),
          consumo: item.consumo
        }));
        setDatos(data);
      } catch (err) {
        console.error(`Error al cargar datos del generador ${generadorId}:`, err);
      }
    };

    if (generadorId) {
      fetchDatos();
    }
  }, [generadorId]);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3>Gráfico de Consumo – Generador ID {generadorId}</h3>
      <LineChart width={600} height={200} data={datos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="consumo" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default GraficoConsumo;