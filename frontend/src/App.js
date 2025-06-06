// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

// Importar componentes
import IngresoDatos from './components/IngresoDatos';
import ListadoGeneradores from './components/ListadoGeneradores';
import AlertaSimulada from './components/AlertaSimulada';

function App() {
  return (
    <Router>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Gestión de Combustible - CANTV Lara
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/reportes">Reportes</Button>
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: '20px' }}>
        <Box sx={{ mb: 4 }}>
          <Routes>
            {/* Página Principal */}
            <Route path="/" element={
              <>
                <Typography variant="h5" gutterBottom>Inicio</Typography>
                <AlertaSimulada />
                <IngresoDatos />
                <hr style={{ margin: '30px 0' }} />
                <ListadoGeneradores />
              </>
            } />

            {/* Página de Reportes (placeholder por ahora) */}
            <Route path="/reportes" element={
              <>
                <Typography variant="h5" gutterBottom>Generación de Reportes</Typography>
                <p>Próximamente podrás generar reportes PDF y Excel desde aquí.</p>
              </>
            } />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;