// components/Dashboard.js

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListadoGeneradores from './ListadoGeneradores';
import GraficoConsumo from './GraficoConsumo';

const Dashboard = () => {
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null); // ✅ Inicia como null

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard de Gestión de Combustible
      </Typography>

      <Grid container spacing={3}>
        {/* Listado de Generadores */}
        <Grid item xs={12} md={6}>
          <ListadoGeneradores onSelect={(id) => setGeneradorSeleccionado(parseInt(id))} />
        </Grid>

        {/* Gráfico de consumo */}
        <Grid item xs={12} md={6}>
          {generadorSeleccionado ? (
            <GraficoConsumo generadorId={generadorSeleccionado} />
          ) : (
            <Typography color="text.secondary">
              Selecciona un generador para ver su gráfico de consumo.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;