"use client"

import React, { useState, useCallback } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import { Container, AppBar, Toolbar, Typography, Button, Box, Divider, ThemeProvider } from "@mui/material"
import { Home, Assessment } from "@mui/icons-material"

// Tema personalizado
import theme from "./theme"

// Componentes importados
import IngresoDatos from "./components/IngresoDatos"
import ListadoGeneradores from "./components/ListadoGeneradores"
import AlertaReal from "./components/AlertaReal"
import GraficoConsumo from "./components/GraficoConsumo"
import ReporteTecnico from "./components/ReporteTecnico"
import Dashboard from "./components/Dashboard"

function App() {
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)

  // ✅ USAR useCallback PARA FUNCIÓN ESTABLE
  const handleGeneradorSelect = useCallback((generadorId) => {
    console.log("App - Generador seleccionado:", generadorId)
    setGeneradorSeleccionado(generadorId)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <AppBar position="static" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                ⛽ Sistema de Gestión de Combustible - CANTV Lara
              </Typography>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<Home />}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Inicio
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/reportes"
                startIcon={<Assessment />}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Reportes
              </Button>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <AlertaReal />
                    <IngresoDatos />
                    <Divider sx={{ my: 4 }} />
                    <ListadoGeneradores onGeneradorSelect={handleGeneradorSelect} />
                    {generadorSeleccionado && (
                      <Box sx={{ mt: 4 }}>
                        <GraficoConsumo generadorId={generadorSeleccionado} />
                      </Box>
                    )}
                  </>
                }
              />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reportes" element={<ReporteTecnico />} />
            </Routes>
          </Container>

          <Box
            sx={{
              textAlign: "center",
              padding: 3,
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
              color: "white",
              mt: 4,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              &copy; {new Date().getFullYear()} - Proyecto Universitario UNETI
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Desarrollado por: Darwin Colmenares, Yannis Iturriago, GianneFran Radomile
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App