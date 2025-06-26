// components/ReporteTecnico.js

import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Alert } from '@mui/material';

const ReporteTecnico = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [mensaje, setMensaje] = useState('');

  const generarReporte = async () => {
    try {
      let url = '/api/consumos/';
      if (desde && hasta) {
        url += `?fecha__gte=${desde}&fecha__lte=${hasta}`;
      }

      const res = await axios.get(url);
      const datos = res.data;

      const contenido = datos.map(item => ({
        Fecha: item.fecha,
        Generador: item.generador,
        NivelActual: `${item.nivel_actual} L`,
        Consumo: `${item.consumo} L`
      }));

      const blob = new Blob([JSON.stringify(contenido, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `reporte_consumo_${desde || 'inicio'}_${hasta || 'fin'}.json`;
      link.click();

      setMensaje("✅ Reporte descargado exitosamente.");
    } catch (err) {
      console.error("Error al generar reporte:", err);
      setMensaje("❌ No se pudo generar el reporte.");
    }
  };

  return (
    <Box component="div" sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Generar Reporte Técnico</Typography>

      <TextField
        label="Desde"
        type="date"
        fullWidth
        margin="normal"
        value={desde}
        onChange={(e) => setDesde(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        label="Hasta"
        type="date"
        fullWidth
        margin="normal"
        value={hasta}
        onChange={(e) => setHasta(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        variant="contained"
        color="secondary"
        onClick={generarReporte}
        fullWidth
        sx={{ mt: 2 }}
      >
        Descargar Reporte (JSON)
      </Button>

      {mensaje && <Alert severity={mensaje.includes("exitosamente") ? "success" : "error"}>{mensaje}</Alert>}
    </Box>
  );
};

export default ReporteTecnico;