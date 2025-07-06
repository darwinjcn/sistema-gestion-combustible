"use client"

import { styled } from "@mui/material/styles"
import { Box, Paper, Typography } from "@mui/material"

// Contenedor principal con gradiente
export const GradientContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  minHeight: "100vh",
  padding: theme.spacing(3),
}))

// Tarjeta con estilo uniforme
export const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 15,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },
}))

// Título con estilo consistente
export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#2c3e50",
  marginBottom: theme.spacing(2),
  textAlign: "center",
}))

// Contenedor de métricas
export const MetricsContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}))

// Tarjeta de métrica
export const MetricCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: 12,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
}))