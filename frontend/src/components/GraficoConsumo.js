"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material"
import { TrendingUp, ShowChart } from "@mui/icons-material"
import { StyledCard, StyledTitle } from "./StyledComponents"

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const GraficoConsumo = ({ generadorId }) => {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!generadorId) return

    const fetchDatos = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`/api/consumos/?generador=${generadorId}`)
        const data = res.data.map((item) => ({
          fecha: new Date(item.fecha).toLocaleDateString("es-ES"),
          consumo: item.consumo,
        }))
        setDatos(data)
      } catch (err) {
        console.error(`Error al cargar datos del generador ${generadorId}:`, err)
        setError("Error al cargar los datos del gráfico")
      } finally {
        setLoading(false)
      }
    }

    fetchDatos()
  }, [generadorId])

  if (!generadorId) {
    return (
      <StyledCard>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <ShowChart sx={{ fontSize: 48, color: "#7f8c8d", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Selecciona un generador para ver su gráfico
          </Typography>
        </Box>
      </StyledCard>
    )
  }

  if (loading) {
    return (
      <StyledCard>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" size={40} />
          <Typography variant="body1" sx={{ mt: 2, color: "#7f8c8d" }}>
            Cargando gráfico...
          </Typography>
        </Box>
      </StyledCard>
    )
  }

  if (error) {
    return (
      <StyledCard>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </StyledCard>
    )
  }

  // Configuración de datos para Chart.js
  const chartData = {
    labels: datos.map((item) => item.fecha),
    datasets: [
      {
        label: "Consumo (L)",
        data: datos.map((item) => item.consumo),
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#3498db",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "Segoe UI",
            size: 12,
            weight: "500",
          },
          color: "#2c3e50",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(44, 62, 80, 0.9)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#3498db",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Consumo (Litros)",
          color: "#2c3e50",
          font: {
            family: "Segoe UI",
            size: 12,
            weight: "500",
          },
        },
        grid: {
          color: "rgba(127, 140, 141, 0.1)",
        },
        ticks: {
          color: "#7f8c8d",
        },
      },
      x: {
        title: {
          display: true,
          text: "Fecha",
          color: "#2c3e50",
          font: {
            family: "Segoe UI",
            size: 12,
            weight: "500",
          },
        },
        grid: {
          color: "rgba(127, 140, 141, 0.1)",
        },
        ticks: {
          color: "#7f8c8d",
        },
      },
    },
  }

  const totalConsumo = datos.reduce((total, item) => total + item.consumo, 0)
  const promedioConsumo = datos.length > 0 ? totalConsumo / datos.length : 0

  return (
    <StyledCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUp color="primary" />
          <StyledTitle variant="h6" sx={{ mb: 0 }}>
            Consumo - Generador ID {generadorId}
          </StyledTitle>
        </Box>
        <Chip label={`${datos.length} registros`} color="primary" variant="outlined" size="small" />
      </Box>

      {/* Métricas rápidas */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            {totalConsumo.toFixed(1)}L
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Consumido
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center", flex: 1 }}>
          <Typography variant="h6" color="success.main" sx={{ fontWeight: "bold" }}>
            {promedioConsumo.toFixed(1)}L
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Promedio
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: "300px" }}>
        <Line data={chartData} options={options} />
      </Box>
    </StyledCard>
  )
}

export default GraficoConsumo