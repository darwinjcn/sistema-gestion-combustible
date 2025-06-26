// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

// Componentes importados
import IngresoDatos from './components/IngresoDatos';
import ListadoGeneradores from './components/ListadoGeneradores';
import AlertaReal from './components/AlertaReal'; // Nueva alerta real
import GraficoConsumo from './components/GraficoConsumo'; // Nuevo componente de gráfico
import ReporteTecnico from './components/ReporteTecnico'; // Generación de reportes

function App() {
  return (
    <Router>
      <div style={{ fontFamily: '"Roboto", sans-serif' }}>
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
              Reportes Técnicos
            </Button>
          </Toolbar>
        </AppBar>

        {/* Contenido principal */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* Vista Principal */}
            <Route path="/" element={
              <>
                <AlertaReal />  {/* Alerta automática según nivel */}
                <IngresoDatos />
                <hr style={{ margin: '30px 0', border: 'none', borderBottom: '1px solid #ccc' }} />
                <ListadoGeneradores />
                <GraficoConsumo generadorId={1} />  {/* Ejemplo para el generador ID 1 */}
              </>
            } />

            {/* Página de Reportes */}
            <Route path="/reportes" element={<ReporteTecnico />} />
          </Routes>
        </Container>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f8f8', color: '#555' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} - Proyecto Universitario UNETI | Desarrollado por:
            Darwin Colmenares, Yannis Iturriago, GianneFran Radomile
          </Typography>
        </Box>
      </div>
    </Router>
  );
}

export default App;