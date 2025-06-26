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
} from "@mui/material"

const ListadoGeneradores = () => {
  const [generadores, setGeneradores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
            <TableRow key={gen.id}>
              <TableCell>{gen.id}</TableCell>
              <TableCell>{gen.modelo}</TableCell>
              <TableCell>{gen.capacidad_tanque}</TableCell>
              <TableCell>{gen.nivel_actual || "N/A"}</TableCell>
              <TableCell>{gen.consumo_total > 0 ? `${gen.consumo_total.toFixed(2)} L` : "0.00 L"}</TableCell>
              <TableCell>
                {gen.estado === "activo" ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>Normal</span>
                ) : (
                  <span style={{ color: "red", fontWeight: "bold" }}>Inactivo</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ListadoGeneradores
