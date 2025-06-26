"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Typography,
} from "@mui/material"

const ListadoGeneradores = ({ onGeneradorSelect }) => {
  const [generadores, setGeneradores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)

  useEffect(() => {
    const fetchGeneradores = async () => {
      try {
        // Obtén todos los generadores
        const responseGeneradores = await axios.get("/api/generadores/")
        const generadoresData = responseGeneradores.data

        // Obtén todos los consumos de una vez
        const responseConsumos = await axios.get("/api/consumos/")
        const todosLosConsumos = responseConsumos.data

        console.log("Todos los consumos:", todosLosConsumos)

        // Para cada generador, calcula su consumo total filtrando localmente
        const generadoresConSuma = generadoresData.map((gen) => {
          // Filtra los consumos que pertenecen a este generador específico
          const consumosDelGenerador = todosLosConsumos.filter((consumo) => consumo.generador === gen.id)

          console.log(`Consumos del generador ${gen.id}:`, consumosDelGenerador)

          // Suma todos los consumos de este generador
          const totalConsumo = consumosDelGenerador.reduce((total, item) => total + (item.consumo || 0), 0)

          console.log(`Total consumo generador ${gen.id}:`, totalConsumo)

          return {
            ...gen,
            consumo_total: totalConsumo,
          }
        })

        console.log("Generadores con suma:", generadoresConSuma)
        setGeneradores(generadoresConSuma)
      } catch (err) {
        console.error("Error cargando datos:", err)
        setError("No se pudieron cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchGeneradores()
  }, [])

  const handleRowClick = (generador) => {
    // Si el mismo generador está seleccionado, lo deseleccionamos (toggle)
    if (generadorSeleccionado === generador.id) {
      setGeneradorSeleccionado(null)
      if (onGeneradorSelect) {
        onGeneradorSelect(null)
      }
    } else {
      // Seleccionar nuevo generador
      setGeneradorSeleccionado(generador.id)
      if (onGeneradorSelect) {
        onGeneradorSelect(generador.id)
      }
    }
  }

  // Función para prevenir la propagación del evento en elementos internos
  const handleChipClick = (event) => {
    event.stopPropagation() // Previene que el evento se propague a la fila
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    )
  }

  return (
    <div>
      {/* Instrucciones para el usuario */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
        💡 Haz clic en cualquier fila para ver el gráfico de consumo del generador
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Modelo</strong>
              </TableCell>
              <TableCell>
                <strong>Capacidad (L)</strong>
              </TableCell>
              <TableCell>
                <strong>Nivel Actual (L)</strong>
              </TableCell>
              <TableCell>
                <strong>Consumo Total (L)</strong>
              </TableCell>
              <TableCell>
                <strong>Estado</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {generadores.map((gen) => (
              <TableRow
                key={gen.id}
                onClick={() => handleRowClick(gen)}
                sx={{
                  cursor: "pointer",
                  backgroundColor: generadorSeleccionado === gen.id ? "#e3f2fd" : "inherit",
                  "&:hover": {
                    backgroundColor: generadorSeleccionado === gen.id ? "#bbdefb" : "#f5f5f5",
                  },
                  transition: "background-color 0.2s ease",
                }}
              >
                <TableCell>
                  <strong>{gen.id}</strong>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {gen.modelo}
                    {generadorSeleccionado === gen.id && (
                      <Chip
                        label="Seleccionado"
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={handleChipClick} // Previene la propagación
                        sx={{
                          cursor: "default", // Cambia el cursor para indicar que no es clickeable
                          pointerEvents: "none", // Hace que el chip no sea clickeable
                        }}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>{gen.capacidad_tanque}</TableCell>
                <TableCell>{gen.nivel_actual || "N/A"}</TableCell>
                <TableCell>
                  <strong>{gen.consumo_total > 0 ? `${gen.consumo_total.toFixed(2)} L` : "0.00 L"}</strong>
                </TableCell>
                <TableCell>
                  <div onClick={handleChipClick}>
                    {gen.estado === "activo" ? (
                      <Chip label="Normal" color="success" size="small" sx={{ pointerEvents: "none" }} />
                    ) : (
                      <Chip label="Inactivo" color="error" size="small" sx={{ pointerEvents: "none" }} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ListadoGeneradores