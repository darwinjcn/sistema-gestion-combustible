"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Alert, Box, Typography, Chip } from "@mui/material"
import { StyledCard } from "./StyledComponents"

const UMBRAL_NIVEL_BAJO = 150

const AlertaReal = () => {
  const [alertas, setAlertas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkNivelesBajos = async () => {
      try {
        console.log("🔍 Verificando niveles de combustible...")
        const res = await axios.get("/api/generadores/")
        
        // ✅ VERIFICAR QUE LA RESPUESTA SEA VÁLIDA
        console.log("📊 Respuesta de API generadores:", res.data)
        
        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("La respuesta de la API no es un array válido")
        }

        const generadores = res.data
        const nuevasAlertas = []

        // ✅ USAR for...of EN LUGAR DE for...in
        for (const gen of generadores) {
          if (gen.estado === "activo" && (gen.nivel_actual || 0) < UMBRAL_NIVEL_BAJO) {
            nuevasAlertas.push({
              id: gen.id,
              mensaje: `Nivel bajo en el generador ${gen.modelo} (ID: ${gen.id})`,
              nivel: gen.nivel_actual || 0,
              tipo: "warning",
            })
          }
        }

        console.log("⚠️ Alertas encontradas:", nuevasAlertas.length)
        setAlertas(nuevasAlertas)
      } catch (err) {
        console.error("❌ Error verificando niveles:", err)
        
        // Mensaje más específico según el tipo de error
        let mensajeError = "Error: No se pudo conectar con la API"
        
        if (err.response?.status === 500) {
          mensajeError = "Error: Problema en el servidor Django"
        } else if (err.response?.status === 401) {
          mensajeError = "Error: No autorizado - verifica tu sesión"
        } else if (err.message?.includes("array")) {
          mensajeError = "Error: Formato de datos inválido del servidor"
        }

        setAlertas([
          {
            id: -1,
            mensaje: mensajeError,
            tipo: "error",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    checkNivelesBajos()
    const interval = setInterval(checkNivelesBajos, 60000) // Cada minuto

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <StyledCard>
        <Typography variant="h6" sx={{ textAlign: "center", color: "#7f8c8d" }}>
          🔍 Verificando niveles de combustible...
        </Typography>
      </StyledCard>
    )
  }

  return (
    <Box sx={{ mb: 3 }}>
      {alertas.length > 0 ? (
        <StyledCard>
          <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            ⚠️ Alertas Activas
            <Chip label={alertas.length} color="warning" size="small" />
          </Typography>
          {alertas.map((alerta, index) => (
            <Alert
              key={`alerta-${index}`}
              severity={alerta.tipo}
              sx={{
                mb: 1,
                borderRadius: 2,
                "& .MuiAlert-message": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                },
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {alerta.mensaje}
                </Typography>
                {alerta.nivel > 0 && (
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Solo {alerta.nivel} L restantes
                  </Typography>
                )}
              </Box>
            </Alert>
          ))}
        </StyledCard>
      ) : (
        <StyledCard>
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              ✅ Todos los generadores tienen niveles normales de combustible
            </Typography>
          </Alert>
        </StyledCard>
      )}
    </Box>
  )
}

export default AlertaReal