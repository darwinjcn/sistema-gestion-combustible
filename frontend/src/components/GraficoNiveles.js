// GraficoNiveles.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const GraficoNiveles = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/generadores/');
        const generadores = res.data;

        const labels = generadores.map(g => `Gen #${g.id}`);
        const niveles = generadores.map(g => g.nivel_actual);

        setData({
          labels: labels,
          datasets: [{
            label: 'Nivel actual de combustible',
            backgroundColor: 'rgba(53,162,235,0.5)',
            borderColor: 'rgba(53,162,235,1)',
            borderWidth: 1,
            data: niveles
          }]
        });
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '600px', height: '400px' }}>
      <h3>Niveles Actuales de Combustible</h3>
      <Bar
        data={{
          labels: data.labels,
          datasets: data.datasets
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Nivel de Combustible por Generador' }
          }
        }}
      />
    </div>
  );
};

export default GraficoNiveles;