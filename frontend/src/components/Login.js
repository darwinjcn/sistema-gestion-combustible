"use client"

import { useState } from "react"
import { TextField, Button, Box, Typography, Alert, InputAdornment, Card, CardContent } from "@mui/material"
import { Person, Lock, Login as LoginIcon } from "@mui/icons-material"
import api from "../services/api"

export default function Login() {
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
      const res = await api.post("/api/login/", {
        username: usuario.trim(),
        password: contraseña,
      })
      const token = res?.data?.token
      if (!token) throw new Error("Sin token")
      localStorage.setItem("token", token)
      setExito(true)
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    } catch (err) {
      console.error("Error de login:", err)
      const detail =
        err?.response?.data?.detail ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        "Credenciales incorrectas o servidor no disponible."
      setError(detail)
    } finally {
      setLoading(false)
    }
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
      <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
        <CardContent>
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
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Gestión de Combustible
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
            <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ py: 1.5 }}>
              {loading ? "Iniciando..." : "🔐 Iniciar Sesión"}
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}
            {exito && (
              <Alert severity="success" sx={{ mt: 2, borderRadius: 1 }}>
                ✅ Sesión iniciada, redirigiendo...
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}