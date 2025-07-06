"use client"

import { useEffect, useState } from "react"
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
        const res = await axios.get("/api/generadores/")
        const generadores = res.data

        const nuevasAlertas = []

        for (const gen of generadores) {
          if (gen.estado === "activo" && gen.nivel_actual < UMBRAL_NIVEL_BAJO) {
            nuevasAlertas.push({
              id: gen.id,
              mensaje: `Nivel bajo en el generador ${gen.modelo} (ID: ${gen.id})`,
              nivel: gen.nivel_actual,
              tipo: "warning",
            })
          }
        }

        setAlertas(nuevasAlertas)
      } catch (err) {
        console.error("No se pudieron verificar niveles:", err)
        setAlertas([
          {
            id: -1,
            mensaje: "Error: No se pudo conectar con la API",
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
          Verificando niveles de combustible...
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
              key={index}
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
                {alerta.nivel && (
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