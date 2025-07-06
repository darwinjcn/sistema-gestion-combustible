"use client"

import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import axios from "axios"
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material"
import { LocalGasStation } from "@mui/icons-material"
import { StyledCard, StyledTitle } from "./StyledComponents"

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GraficoNiveles = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/generadores/")
        const generadores = res.data

        const labels = generadores.map((g) => `${g.modelo}`)
        const niveles = generadores.map((g) => g.nivel_actual || 0)
        const capacidades = generadores.map((g) => g.capacidad_tanque || 0)

        setData({
          labels: labels,
          datasets: [
            {
              label: "Nivel Actual (L)",
              backgroundColor: generadores.map((g) => {
                const porcentaje = ((g.nivel_actual || 0) / (g.capacidad_tanque || 1)) * 100
                if (porcentaje > 70) return "#27ae60"
                if (porcentaje > 30) return "#f39c12"
                return "#e74c3c"
              }),
              borderColor: "rgba(255, 255, 255, 0.8)",
              borderWidth: 2,
              data: niveles,
              borderRadius: 6,
            },
            {
              label: "Capacidad Total (L)",
              backgroundColor: "rgba(102, 126, 234, 0.2)",
              borderColor: "#667eea",
              borderWidth: 2,
              data: capacidades,
              borderRadius: 6,
            },
          ],
        })
      } catch (err) {
        console.error("Error al obtener datos:", err)
        setError("Error al cargar los datos de niveles")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <StyledCard>
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress color="primary" size={40} />
          <Typography variant="body1" sx={{ mt: 2, color: "#7f8c8d" }}>
            Cargando niveles...
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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
          text: "Nivel (Litros)",
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
        grid: {
          color: "rgba(127, 140, 141, 0.1)",
        },
        ticks: {
          color: "#7f8c8d",
        },
      },
    },
  }

  return (
    <StyledCard>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalGasStation color="primary" />
          <StyledTitle variant="h6" sx={{ mb: 0 }}>
            Niveles de Combustible por Generador
          </StyledTitle>
        </Box>
        <Chip label={`${data.labels.length} generadores`} color="primary" variant="outlined" size="small" />
      </Box>

      <Box sx={{ height: "400px" }}>
        <Bar data={data} options={options} />
      </Box>
    </StyledCard>
  )
}

export default GraficoNiveles