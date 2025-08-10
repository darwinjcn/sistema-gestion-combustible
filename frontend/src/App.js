"use client"

import { useCallback, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom"
import { Container, AppBar, Toolbar, Typography, Button, Box, Divider } from "@mui/material"
import { Home, Assessment } from "@mui/icons-material"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import AlertaReal from "./components/AlertaReal"
import IngresoDatos from "./components/IngresoDatos"
import ListadoGeneradores from "./components/ListadoGeneradores"
import GraficoConsumo from "./components/GraficoConsumo"
import ReporteTecnico from "./components/ReporteTecnico"
import Dashboard from "./components/Dashboard"
import LogoutButton from "./components/LogoutButton"

function AppShell() {
  const navigate = useNavigate()
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)
  const handleGeneradorSelect = useCallback((id) => setGeneradorSeleccionado(id), [])
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    navigate("/login", { replace: true })
  }, [navigate])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            ⛽ Sistema de Gestión de Combustible - CANTV Lara
          </Typography>
          <Button color="inherit" component={Link} to="/" startIcon={<Home />} sx={{ mx: 1, borderRadius: 2 }}>
            Inicio
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/reportes"
            startIcon={<Assessment />}
            sx={{ mx: 1, borderRadius: 2 }}
          >
            Reportes
          </Button>
          <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, borderRadius: 2 }}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
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
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <ReporteTecnico />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>

      <LogoutButton />

      <Box
        sx={{
          textAlign: "center",
          p: 3,
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
  )
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  )
}