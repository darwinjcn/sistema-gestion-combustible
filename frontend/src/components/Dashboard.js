"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Box, Typography, Grid, Chip } from "@mui/material"
import axios from "axios"
import ListadoGeneradores from "./ListadoGeneradores"
import GraficoConsumo from "./GraficoConsumo"
import { StyledCard, StyledTitle, MetricsContainer, MetricCard } from "./StyledComponents"

const Dashboard = () => {
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)
  const [metricas, setMetricas] = useState({
    totalGeneradores: 0,
    generadoresActivos: 0,
    consumoTotal: 0,
    nivelPromedio: 0,
  })

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const [resGeneradores, resConsumos] = await Promise.all([
          axios.get("/api/generadores/"),
          axios.get("/api/consumos/"),
        ])

        const generadores = resGeneradores.data
        const consumos = resConsumos.data

        const totalGeneradores = generadores.length
        const generadoresActivos = generadores.filter((g) => g.estado === "activo").length
        const consumoTotal = consumos.reduce((total, c) => total + c.consumo, 0)
        const nivelPromedio = generadores.reduce((total, g) => total + (g.nivel_actual || 0), 0) / totalGeneradores

        setMetricas({
          totalGeneradores,
          generadoresActivos,
          consumoTotal,
          nivelPromedio,
        })
      } catch (err) {
        console.error("Error cargando métricas:", err)
      }
    }

    fetchMetricas()
  }, [])

  // ✅ USAR useCallback PARA FUNCIÓN ESTABLE
  const handleGeneradorSelect = useCallback((generadorId) => {
    console.log("Dashboard - Generador seleccionado:", generadorId)
    setGeneradorSeleccionado(generadorId)
  }, [])

  return (
    <Box sx={{ p: 3 }}>
      <StyledTitle variant="h4">⚡ Dashboard de Gestión de Combustible</StyledTitle>

      <MetricsContainer>
        <MetricCard>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {metricas.totalGeneradores}
          </Typography>
          <Typography variant="body1">Total Generadores</Typography>
        </MetricCard>

        <MetricCard>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {metricas.generadoresActivos}
          </Typography>
          <Typography variant="body1">Generadores Activos</Typography>
        </MetricCard>

        <MetricCard>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {metricas.consumoTotal.toFixed(1)}L
          </Typography>
          <Typography variant="body1">Consumo Total</Typography>
        </MetricCard>

        <MetricCard>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {metricas.nivelPromedio.toFixed(1)}L
          </Typography>
          <Typography variant="body1">Nivel Promedio</Typography>
        </MetricCard>
      </MetricsContainer>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ListadoGeneradores onGeneradorSelect={handleGeneradorSelect} />
        </Grid>

        <Grid item xs={12} lg={6}>
          {generadorSeleccionado ? (
            <StyledCard>
              <GraficoConsumo generadorId={generadorSeleccionado} />
            </StyledCard>
          ) : (
            <StyledCard>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  📊 Análisis de Consumo
                </Typography>
                <Typography color="text.secondary">
                  Selecciona un generador de la tabla para ver su gráfico de consumo detallado
                </Typography>
                <Chip label="Esperando selección..." color="primary" variant="outlined" sx={{ mt: 2 }} />
              </Box>
            </StyledCard>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard