"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Container, AppBar, Toolbar, Typography, Button, Box, Divider } from "@mui/material"

// Componentes importados
import IngresoDatos from "./components/IngresoDatos"
import ListadoGeneradores from "./components/ListadoGeneradores"
import AlertaReal from "./components/AlertaReal"
import GraficoConsumo from "./components/GraficoConsumo"
import ReporteTecnico from "./components/ReporteTecnico"

function App() {
  // Estado para manejar qué generador está seleccionado
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)

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
            <Route
              path="/"
              element={
                <>
                  <AlertaReal />
                  <IngresoDatos />

                  <Divider sx={{ my: 4 }} />

                  {/* Pasar la función de selección al ListadoGeneradores */}
                  <ListadoGeneradores onGeneradorSelect={setGeneradorSeleccionado} />

                  {/* Mostrar el gráfico solo si hay un generador seleccionado */}
                  {generadorSeleccionado && (
                    <Box sx={{ mt: 4 }}>
                      <GraficoConsumo generadorId={generadorSeleccionado} />
                    </Box>
                  )}
                </>
              }
            />

            {/* Página de Reportes */}
            <Route path="/reportes" element={<ReporteTecnico />} />
          </Routes>
        </Container>

        {/* Footer */}
        <Box sx={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f8f8", color: "#555" }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} - Proyecto Universitario UNETI | Desarrollado por: Darwin Colmenares,
            Yannis Iturriago, GianneFran Radomile
          </Typography>
        </Box>
      </div>
    </Router>
  )
}

export default App