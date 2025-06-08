// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IngresoDatos from './components/IngresoDatos';
import ListadoGeneradores from './components/ListadoGeneradores';
import AlertaSimulada from './components/AlertaSimulada';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Barra de navegación */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sistema Web de Gestión de Combustible - CANTV Lara
            </Typography>
            <Button color="inherit">Inicio</Button>
            <Button color="inherit">Reportes</Button>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Box sx={{ p: 2, flex: 1 }}>
          <Routes>
            {/* Página Principal */}
            <Route path="/" element={
              <>
                <Typography variant="h5" gutterBottom>Ingreso Manual de Datos</Typography>
                <AlertaSimulada />
                <IngresoDatos />
                <hr style={{ margin: '30px 0' }} />
                <ListadoGeneradores />
              </>
            } />

            {/* Página de Reportes (placeholder) */}
            <Route path="/reportes" element={
              <>
                <Typography variant="h5" gutterBottom>Generación de Reportes</Typography>
                <p>Próximamente podrás generar reportes PDF y Excel desde aquí.</p>
              </>
            } />
          </Routes>
        </Box>
      </div>
    </Router>
  );
}

export default App;