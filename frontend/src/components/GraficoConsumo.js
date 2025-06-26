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

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const GraficoConsumo = ({ generadorId }) => {
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)

  // Evita hacer llamados si no hay ID válido
  useEffect(() => {
    if (!generadorId) return

    const fetchDatos = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/consumos/?generador=${generadorId}`)
        const data = res.data.map((item) => ({
          fecha: new Date(item.fecha).toLocaleDateString("es-ES"),
          consumo: item.consumo,
        }))
        setDatos(data)
      } catch (err) {
        console.error(`Error al cargar datos del generador ${generadorId}:`, err)
      } finally {
        setLoading(false)
      }
    }

    fetchDatos()
  }, [generadorId])

  if (!generadorId) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>⚠️ Selecciona un generador para ver su gráfico.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Cargando gráfico...</p>
      </div>
    )
  }

  // Configuración de datos para Chart.js
  const chartData = {
    labels: datos.map((item) => item.fecha),
    datasets: [
      {
        label: "Consumo (L)",
        data: datos.map((item) => item.consumo),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
      },
    ],
  }

  // Opciones del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Consumo de Combustible - Generador ID ${generadorId}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Consumo (Litros)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Fecha",
        },
      },
    },
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div style={{ height: "400px" }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

export default GraficoConsumo