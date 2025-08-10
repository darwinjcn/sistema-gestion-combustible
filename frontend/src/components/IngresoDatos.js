"use client"

import { useState } from "react"
import { TextField, Button, Box, Alert, Grid, InputAdornment, Card, CardContent, Typography } from "@mui/material"
import { LocalGasStation, Battery20, BatteryFull } from "@mui/icons-material"
import api from "../services/api"

export default function IngresoDatos() {
  const [nivel, setNivel] = useState("")
  const [generadorId, setGeneradorId] = useState("")
  const [consumo, setConsumo] = useState("")
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(false)
    setLoading(true)

    if (!nivel || !generadorId || !consumo) {
      setError("Por favor completa todos los campos.")
      setLoading(false)
      return
    }

    try {
      const res = await api.post("/api/consumos/", {
        nivel_actual: Number.parseFloat(nivel),
        consumo: Number.parseFloat(consumo),
        generador: Number.parseInt(generadorId, 10),
      })
      console.log("Datos guardados:", res.data)
      setExito(true)
      setNivel("")
      setGeneradorId("")
      setConsumo("")
    } catch (err) {
      console.error("Error al guardar los datos:", err)
      const msg = err.response?.data
        ? typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data)
        : "Error desconocido al guardar los datos"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          📊 Ingreso Manual de Datos
        </Typography>

        {exito && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
            ✅ Datos guardados correctamente
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="ID del Generador"
                type="number"
                fullWidth
                value={generadorId}
                onChange={(e) => setGeneradorId(e.target.value)}
                required
                inputProps={{ min: "1", step: "1" }}
                helperText="ID del generador existente"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalGasStation color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Nivel Actual (L)"
                type="number"
                fullWidth
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                required
                inputProps={{ min: "0", step: "any" }}
                helperText="Ejemplo: 750.50"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BatteryFull color="success" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Consumo (L)"
                type="number"
                fullWidth
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
                required
                inputProps={{ min: "0", step: "any" }}
                helperText="Ejemplo: 50.25"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Battery20 color="warning" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? "Guardando..." : "💾 Guardar Datos"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}