// components/ReporteTecnico.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material';

// Servicios de exportación
import { exportToExcel, exportToPDF } from '../services/exportService';

const ReporteTecnico = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleExport = async (formato) => {
    try {
      let url = '/api/consumos/';
      if (desde && hasta) {
        url += `?fecha__gte=${desde}&fecha__lte=${hasta}`;
      }

      const res = await axios.get(url);
      const datos = res.data;

      if (formato === 'excel') {
        exportToExcel(datos, desde, hasta);
        setMensaje("✅ Reporte Excel descargado exitosamente.");
      } else if (formato === 'pdf') {
        exportToPDF(datos, desde, hasta);
        setMensaje("✅ Reporte PDF descargado exitosamente.");
      } else {
        // Descarga en JSON por defecto
        const blob = new Blob([JSON.stringify(datos, null, 2)], {
          type: 'application/json'
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_consumo_${desde || 'inicio'}_${hasta || 'fin'}.json`;
        link.click();
        setMensaje("✅ Reporte JSON descargado exitosamente.");
      }
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
        onClick={() => handleExport('json')}
        sx={{ mr: 2, mt: 2 }}
      >
        Descargar JSON
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleExport('excel')}
        sx={{ mr: 2, mt: 2 }}
      >
        Descargar Excel
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={() => handleExport('pdf')}
        sx={{ mt: 2 }}
      >
        Descargar PDF
      </Button>

      {mensaje && (
        <Alert severity={mensaje.includes("exitosamente") ? "success" : "error"}>{mensaje}</Alert>
      )}
    </Box>
  );
};

export default ReporteTecnico;