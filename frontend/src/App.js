import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material'; // Importa Button aquí
import IngresoDatos from './components/IngresoDatos';
import ListadoGeneradores from './components/ListadoGeneradores';
import AlertaSimulada from './components/AlertaSimulada';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
        {/* Barra de navegación */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sistema Web de Gestión de Combustible - CANTV Lara
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>
              Inicio
            </Button>
            <Button color="inherit" component={Link} to="/reportes" sx={{ mx: 1 }}>
              Reportes
            </Button>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Container maxWidth="lg" style={{ marginTop: '30px', marginBottom: '50px' }}>
          <Routes>
            {/* Vista Principal */}
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
        </Container>
      </div>
    </Router>
  );
}

export default App;