// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

// Componentes
import IngresoDatos from './components/IngresoDatos';
import ListadoGeneradores from './components/ListadoGeneradores';
import AlertaSimulada from './components/AlertaSimulada';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: '"Roboto", sans-serif' }}>
        {/* Barra de navegación */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Sistema Web - CANTV Lara
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* Página Principal */}
            <Route path="/" element={
              <>
                <AlertaSimulada />
                <IngresoDatos />
                <hr style={{ margin: '30px 0', border: 'none', borderBottom: '1px solid #ccc' }} />
                <ListadoGeneradores />
              </>
            } />

            {/* Placeholder para reportes */}
            <Route path="/reportes" element={
              <>
                <Typography variant="h5" gutterBottom>Generación de Reportes</Typography>
                <p>Próximamente podrás generar reportes PDF y Excel desde aquí.</p>
              </>
            } />
          </Routes>
        </Container>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', color: '#555' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} - Proyecto Universitario UNETI | Desarrollado por: Darwin Colmenares, Yannis Iturriago, GianneFran Radomile
          </Typography>
        </Box>
      </div>
    </Router>
  );
}

export default App;