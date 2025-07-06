"use client"

import { useState } from "react"
import { TextField, Button, Box, Alert, Grid, InputAdornment } from "@mui/material"
import { LocalGasStation, Battery20, BatteryFull } from "@mui/icons-material"
import axios from "axios"
import { StyledCard, StyledTitle } from "./StyledComponents"

const IngresoDatos = () => {
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
      const response = await axios.post("/api/consumos/", {
        nivel_actual: Number.parseFloat(nivel),
        consumo: Number.parseFloat(consumo),
        generador: Number.parseInt(generadorId),
      })

      console.log("Datos guardados:", response.data)
      setExito(true)
      // Limpiar formulario
      setNivel("")
      setGeneradorId("")
      setConsumo("")
    } catch (err) {
      console.error("Error al guardar los datos:", err.response?.data || err.message)
      setError(err.response?.data || "Error desconocido al guardar los datos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <StyledCard>
      <StyledTitle variant="h5">📊 Ingreso Manual de Datos</StyledTitle>

      {/* Mensaje de éxito */}
      {exito && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          ✅ Datos guardados correctamente
        </Alert>
      )}

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          {/* ID del Generador */}
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

          {/* Nivel Actual */}
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

          {/* Consumo */}
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

        {/* Botón Guardar */}
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading} sx={{ mt: 3, py: 1.5 }}>
          {loading ? "Guardando..." : "💾 Guardar Datos"}
        </Button>
      </Box>
    </StyledCard>
  )
}

export default IngresoDatos