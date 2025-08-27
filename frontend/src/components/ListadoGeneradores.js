"use client"

import React, { useEffect, useState, useCallback } from "react"
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

// Configurar axios con las URLs y credenciales correctas
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

// Función para obtener el token CSRF
const getCSRFToken = () => {
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrftoken') {
      return value
    }
  }
  return null
}

// Configurar headers por defecto
axios.interceptors.request.use(
  (config) => {
    const token = getCSRFToken()
    if (token) {
      config.headers['X-CSRFToken'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

const ListadoGeneradores = ({ onGeneradorSelect }) => {
const [generadores, setGeneradores] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [generadorSeleccionado, setGeneradorSeleccionado] = useState(null)

useEffect(() => {
  const fetchGeneradores = async () => {
    try {
      console.log("🔍 Cargando generadores...")
      
      // URLs corregidas según tu configuración de Django
      const responseGeneradores = await axios.get("/api/combustible_api/generadores/")
      
      console.log("📊 Respuesta generadores:", responseGeneradores.data)
      
      if (!responseGeneradores.data || !Array.isArray(responseGeneradores.data)) {
        throw new Error("La respuesta de generadores no es un array válido")
      }

      const generadoresData = responseGeneradores.data

      console.log("🔍 Cargando consumos...")
      const responseConsumos = await axios.get("/api/combustible_api/consumos/")
      
      console.log("📊 Respuesta consumos:", responseConsumos.data)
      
      if (!responseConsumos.data || !Array.isArray(responseConsumos.data)) {
        console.warn("⚠️ Respuesta de consumos no es válida, usando array vacío")
      }

      const todosLosConsumos = Array.isArray(responseConsumos.data) ? responseConsumos.data : []

      const generadoresConSuma = generadoresData.map((gen) => {
        if (!gen || typeof gen.id === 'undefined') {
          console.warn("⚠️ Generador inválido encontrado:", gen)
          return null
        }

        const consumosDelGenerador = todosLosConsumos.filter((consumo) => 
          consumo && consumo.generador === gen.id
        )
        
        const totalConsumo = consumosDelGenerador.reduce((total, item) => 
          total + (item?.consumo || 0), 0
        )

        return {
          ...gen,
          consumo_total: totalConsumo,
        }
      }).filter(Boolean)

      console.log("✅ Generadores procesados:", generadoresConSuma.length)
      setGeneradores(generadoresConSuma)
    } catch (err) {
      console.error("❌ Error cargando datos:", err)
      
      let mensajeError = "No se pudieron cargar los datos"
      
      if (err.response?.status === 500) {
        mensajeError = "Error del servidor Django - verifica la base de datos"
      } else if (err.response?.status === 401) {
        mensajeError = "No autorizado - inicia sesión primero"
      } else if (err.response?.status === 403) {
        mensajeError = "Sin permisos - verifica tu autenticación"
      } else if (err.message?.includes("array")) {
        mensajeError = "Formato de datos inválido del servidor"
      } else if (err.code === 'ERR_NETWORK') {
        mensajeError = "No se puede conectar con Django en localhost:8000"
      }
      
      setError(mensajeError)
    } finally {
      setLoading(false)
    }
  }

  fetchGeneradores()
}, [])

const handleRowClick = useCallback((generador) => {
  if (!generador || !generador.id) {
    console.warn("⚠️ Generador inválido para selección")
    return
  }

  console.log("🖱️ Fila clickeada:", generador.id)
  
  const nuevoGeneradorSeleccionado = generadorSeleccionado === generador.id ? null : generador.id
  setGeneradorSeleccionado(nuevoGeneradorSeleccionado)
  
  if (typeof onGeneradorSelect === 'function') {
    onGeneradorSelect(nuevoGeneradorSeleccionado)
  } else {
    console.warn("⚠️ onGeneradorSelect no es una función válida")
  }
}, [generadorSeleccionado, onGeneradorSelect])

if (loading) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Cargando generadores...</Typography>
    </div>
  )
}

if (error) {
  return (
    <Alert severity="error" style={{ margin: "20px" }}>
      <Typography variant="h6">Error al cargar datos</Typography>
      <Typography>{error}</Typography>
      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        Verifica que Django esté ejecutándose en http://localhost:8000 y que estés autenticado
      </Typography>
    </Alert>
  )
}

if (!generadores || generadores.length === 0) {
  return (
    <Alert severity="info" style={{ margin: "20px" }}>
      <Typography variant="h6">No hay generadores disponibles</Typography>
      <Typography>Agrega generadores desde el panel de administración de Django</Typography>
    </Alert>
  )
}

return (
  <div>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: "italic" }}>
      💡 Haz clic en cualquier fila para ver el gráfico de consumo del generador
    </Typography>

    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Modelo</strong></TableCell>
            <TableCell><strong>Capacidad (L)</strong></TableCell>
            <TableCell><strong>Nivel Actual (L)</strong></TableCell>
            <TableCell><strong>Consumo Total (L)</strong></TableCell>
            <TableCell><strong>Estado</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generadores.map((gen) => (
            <TableRow
              key={`generador-${gen.id}`}
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
                  {gen.modelo || "Sin modelo"}
                  {generadorSeleccionado === gen.id && (
                    <Chip
                      label="Seleccionado"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ cursor: "default", pointerEvents: "none" }}
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>{gen.capacidad_tanque || "N/A"}</TableCell>
              <TableCell>{gen.nivel_actual || "N/A"}</TableCell>
              <TableCell>
                <strong>
                  {gen.consumo_total > 0 ? `${gen.consumo_total.toFixed(2)} L` : "0.00 L"}
                </strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={gen.estado === "activo" ? "Normal" : "Inactivo"}
                  color={gen.estado === "activo" ? "success" : "error"}
                  size="small"
                  sx={{ pointerEvents: "none" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)
}

ListadoGeneradores.defaultProps = {
onGeneradorSelect: (id) => console.log("onGeneradorSelect no proporcionado, ID:", id)
}

export default ListadoGeneradores