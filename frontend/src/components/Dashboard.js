// components/Dashboard.js

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GraficoConsumo from './GraficoConsumo';
import ListadoGeneradores from './ListadoGeneradores';

const Dashboard = () => {
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(1);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard de Gestión de Combustible
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ListadoGeneradores onSelect={(id) => setGeneradorSeleccionado(id)} />
        </Grid>

        <Grid item xs={12} md={6}>
          {generadorSeleccionado && (
            <GraficoConsumo generadorId={generadorSeleccionado} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;