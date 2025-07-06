"use client"

import { useState } from "react"
import { TextField, Button, Box, Typography, Alert, InputAdornment } from "@mui/material"
import { Person, Lock, Login as LoginIcon } from "@mui/icons-material"
import axios from "axios"
import { StyledCard, StyledTitle } from "./StyledComponents"

const Login = () => {
  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [error, setError] = useState("")
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setExito(false)
    setLoading(true)

    if (!usuario || !contraseña) {
      setError("Por favor completa ambos campos.")
      setLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/token-auth/", {
        username: usuario,
        password: contraseña,
      })

      localStorage.setItem("token", response.data.token)
      setExito(true)

      // Opcional: redirigir después del login exitoso
      setTimeout(() => {
        window.location.href = "/"
      }, 1500)
    } catch (err) {
      console.error("Error de login:", err)
      setError("Credenciales incorrectas o servidor no disponible.")
    } finally {
      setLoading(false)
    }
  }

  if (exito) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <StyledCard sx={{ maxWidth: 400, width: "100%" }}>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <LoginIcon sx={{ fontSize: 48, color: "#27ae60", mb: 2 }} />
            <Alert severity="success" sx={{ borderRadius: 2, mb: 2 }}>
              ✅ Sesión iniciada correctamente
            </Alert>
            <Typography variant="body1" color="text.secondary">
              Redirigiendo al dashboard...
            </Typography>
          </Box>
        </StyledCard>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <StyledCard sx={{ maxWidth: 400, width: "100%" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3498db 0%, #667eea 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <LoginIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <StyledTitle variant="h5">Iniciar Sesión</StyledTitle>
          <Typography variant="body2" color="text.secondary">
            Sistema de Gestión de Combustible - CANTV Lara
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Usuario"
            type="text"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {loading ? "Iniciando sesión..." : "🔐 Iniciar Sesión"}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: "1px solid #eee" }}>
          <Typography variant="caption" color="text.secondary">
            Proyecto Universitario UNETI
          </Typography>
        </Box>
      </StyledCard>
    </Box>
  )
}

export default Login