"use client"

import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"
import axios from "axios"

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const GraficoNiveles = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/generadores/")
        const generadores = res.data

        const labels = generadores.map((g) => `Gen #${g.id} (${g.modelo})`)
        const niveles = generadores.map((g) => g.nivel_actual || 0)

        setData({
          labels: labels,
          datasets: [
            {
              label: "Nivel actual de combustible (L)",
              backgroundColor: "rgba(53,162,235,0.5)",
              borderColor: "rgba(53,162,235,1)",
              borderWidth: 1,
              data: niveles,
            },
          ],
        })
      } catch (err) {
        console.error("Error al obtener datos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Cargando gráfico...</div>
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Nivel de Combustible por Generador",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Nivel (Litros)",
        },
      },
    },
  }

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div style={{ height: "400px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

export default GraficoNiveles