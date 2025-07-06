"use client"

import { useState } from "react"
import axios from "axios"
import { Box, Typography, TextField, Button, Alert, Grid, Card, CardContent, Chip, InputAdornment } from "@mui/material"
import { GetApp, PictureAsPdf, TableChart, DateRange, Assessment } from "@mui/icons-material"
import { StyledCard, StyledTitle } from "./StyledComponents"

// Servicios de exportación
import { exportToExcel, exportToPDF } from "../services/exportService"

const ReporteTecnico = () => {
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [loading, setLoading] = useState(false)
  const [datosPreview, setDatosPreview] = useState(null)

  const handlePreview = async () => {
    setLoading(true)
    try {
      let url = "/api/consumos/"
      const params = []
      if (desde) params.push(`fecha__gte=${desde}`)
      if (hasta) params.push(`fecha__lte=${hasta}`)
      if (params.length > 0) url += `?${params.join("&")}`

      const res = await axios.get(url)
      setDatosPreview(res.data)
      setMensaje("")
    } catch (err) {
      console.error("Error al obtener preview:", err)
      setMensaje("❌ Error al cargar los datos para el preview.")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (formato) => {
    setLoading(true)
    try {
      let url = "/api/consumos/"
      const params = []
      if (desde) params.push(`fecha__gte=${desde}`)
      if (hasta) params.push(`fecha__lte=${hasta}`)
      if (params.length > 0) url += `?${params.join("&")}`

      const res = await axios.get(url)
      const datos = res.data

      if (datos.length === 0) {
        setMensaje("⚠️ No hay datos para exportar en el rango seleccionado.")
        return
      }

      if (formato === "excel") {
        exportToExcel(datos, desde, hasta)
        setMensaje("✅ Reporte Excel descargado exitosamente.")
      } else if (formato === "pdf") {
        exportToPDF(datos, desde, hasta)
        setMensaje("✅ Reporte PDF descargado exitosamente.")
      } else {
        // Descarga en JSON por defecto
        const blob = new Blob([JSON.stringify(datos, null, 2)], {
          type: "application/json",
        })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `reporte_consumo_${desde || "inicio"}_${hasta || "fin"}.json`
        link.click()
        setMensaje("✅ Reporte JSON descargado exitosamente.")
      }
    } catch (err) {
      console.error("Error al generar reporte:", err)
      setMensaje("❌ No se pudo generar el reporte.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <StyledTitle variant="h4">📊 Reportes Técnicos</StyledTitle>

      <Grid container spacing={3}>
        {/* Panel de filtros */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <DateRange color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Filtros de Fecha
              </Typography>
            </Box>

            <TextField
              label="Desde"
              type="date"
              fullWidth
              margin="normal"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Hasta"
              type="date"
              fullWidth
              margin="normal"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRange color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="outlined"
              color="primary"
              onClick={handlePreview}
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Cargando..." : "👁️ Vista Previa"}
            </Button>
          </StyledCard>
        </Grid>

        {/* Panel de exportación */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Assessment color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
                Generar Reportes
              </Typography>
            </Box>

            {/* Preview de datos */}
            {datosPreview && (
              <Card sx={{ mb: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    📋 Resumen de Datos
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Chip label={`${datosPreview.length} registros`} color="primary" variant="outlined" />
                    <Chip label={`Desde: ${desde || "Inicio"}`} color="info" variant="outlined" />
                    <Chip label={`Hasta: ${hasta || "Fin"}`} color="info" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleExport("excel")}
                  fullWidth
                  disabled={loading}
                  startIcon={<TableChart />}
                  sx={{ py: 1.5 }}
                >
                  Excel
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleExport("pdf")}
                  fullWidth
                  disabled={loading}
                  startIcon={<PictureAsPdf />}
                  sx={{ py: 1.5 }}
                >
                  PDF
                </Button>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleExport("json")}
                  fullWidth
                  disabled={loading}
                  startIcon={<GetApp />}
                  sx={{ py: 1.5 }}
                >
                  JSON
                </Button>
              </Grid>
            </Grid>

            {mensaje && (
              <Alert
                severity={mensaje.includes("exitosamente") ? "success" : mensaje.includes("⚠️") ? "warning" : "error"}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                {mensaje}
              </Alert>
            )}
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReporteTecnico