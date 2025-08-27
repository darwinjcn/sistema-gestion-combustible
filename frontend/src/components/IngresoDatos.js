"use client"

import { useState } from "react"
import { 
  TextField, 
  Button, 
  Box, 
  Alert, 
  Grid, 
  InputAdornment, 
  Card, 
  CardContent, 
  Typography,
  Tabs,
  Tab,
  Paper,
  LinearProgress
} from "@mui/material"
import { LocalGasStation, Battery20, BatteryFull, CloudUpload, Edit } from "@mui/icons-material"
import api from "../services/api"

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

export default function IngresoDatos() {
  // Estados para ingreso manual
  const [nivel, setNivel] = useState("")
  const [generadorId, setGeneradorId] = useState("")
  const [consumo, setConsumo] = useState("")
  const [error, setError] = useState(null)
  const [exito, setExito] = useState(false)
  const [loading, setLoading] = useState(false)

  // Estados para carga masiva
  const [archivo, setArchivo] = useState(null)
  const [cargandoArchivo, setCargandoArchivo] = useState(false)
  const [mensajeArchivo, setMensajeArchivo] = useState('')
  const [erroresArchivo, setErroresArchivo] = useState([])

  // Estado para las tabs
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    // Limpiar mensajes al cambiar de tab
    setError(null)
    setExito(false)
    setMensajeArchivo('')
    setErroresArchivo([])
  }

  // Función para ingreso manual
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setExito(false)
    setLoading(true)

    if (!nivel || !generadorId || !consumo) {
      setError("Por favor completa todos los campos.")
      setLoading(false)
      return
    }

    try {
      const res = await api.post("/api/consumos/", {
        nivel_actual: Number.parseFloat(nivel),
        consumo: Number.parseFloat(consumo),
        generador: Number.parseInt(generadorId, 10),
      })
      console.log("Datos guardados:", res.data)
      setExito(true)
      setNivel("")
      setGeneradorId("")
      setConsumo("")
    } catch (err) {
      console.error("Error al guardar los datos:", err)
      const msg = err.response?.data
        ? typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data)
        : "Error desconocido al guardar los datos"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Funciones para carga masiva
  const handleFileChange = (e) => {
    setArchivo(e.target.files[0])
    setMensajeArchivo('')
    setErroresArchivo([])
  }

  const handleUpload = async () => {
    if (!archivo) {
      setMensajeArchivo('Por favor selecciona un archivo.')
      return
    }

    const formData = new FormData()
    formData.append('archivo', archivo)

    setCargandoArchivo(true)
    setMensajeArchivo('')
    setErroresArchivo([])

    try {
      // URL corregida según la estructura establecida
      const response = await api.post('/api/combustible_api/carga-masiva/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMensajeArchivo(response.data.mensaje)
      if (response.data.errores && response.data.errores.length > 0) {
        setErroresArchivo(response.data.errores)
      }

    } catch (err) {
      console.error('Error en carga masiva:', err)
      
      let errorMsg = 'Error desconocido al subir el archivo.'
      
      if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Archivo inválido o datos incorrectos.'
      } else if (err.response?.status === 401) {
        errorMsg = 'No autorizado. Verifica tu sesión.'
      } else if (err.response?.status === 500) {
        errorMsg = 'Error del servidor. Verifica que Django esté funcionando.'
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'No se puede conectar con el servidor en localhost:8000.'
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error
      }
      
      setMensajeArchivo(`⚠️ Error: ${errorMsg}`)
    } finally {
      setCargandoArchivo(false)
    }
  }

  return (
    <Card sx={{ borderRadius: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          📊 Gestión de Datos de Combustible
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              icon={<Edit />} 
              label="Ingreso Manual" 
              sx={{ textTransform: 'none' }}
            />
            <Tab 
              icon={<CloudUpload />} 
              label="Carga Masiva" 
              sx={{ textTransform: 'none' }}
            />
          </Tabs>
        </Box>

        {/* Tab Panel 1: Ingreso Manual */}
        <TabPanel value={tabValue} index={0}>
          {exito && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
              ✅ Datos guardados correctamente
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="ID del Generador"
                  type="number"
                  fullWidth
                  value={generadorId}
                  onChange={(e) => setGeneradorId(e.target.value)}
                  required
                  inputProps={{ min: "1", step: "1" }}
                  helperText="ID del generador existente"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalGasStation color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Nivel Actual (L)"
                  type="number"
                  fullWidth
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  required
                  inputProps={{ min: "0", step: "any" }}
                  helperText="Ejemplo: 750.50"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BatteryFull color="success" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Consumo (L)"
                  type="number"
                  fullWidth
                  value={consumo}
                  onChange={(e) => setConsumo(e.target.value)}
                  required
                  inputProps={{ min: "0", step: "any" }}
                  helperText="Ejemplo: 50.25"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Battery20 color="warning" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{ mt: 3, py: 1.5 }}
            >
              {loading ? "Guardando..." : "💾 Guardar Datos"}
            </Button>
          </Box>
        </TabPanel>

        {/* Tab Panel 2: Carga Masiva */}
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom color="primary">
              📁 Carga Masiva de Datos (CSV/Excel)
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sube un archivo CSV o Excel con las columnas: <strong>generador_id, nivel_actual, consumo</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
              Ejemplo de formato:
              <br />
              <code>generador_id,nivel_actual,consumo</code>
              <br />
              <code>1,750.5,25.3</code>
              <br />
              <code>2,600.0,30.7</code>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                style={{ 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  flex: 1
                }}
              />
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!archivo || cargandoArchivo}
                sx={{ minWidth: '120px' }}
                startIcon={<CloudUpload />}
              >
                {cargandoArchivo ? 'Cargando...' : 'Subir Archivo'}
              </Button>
            </Box>

            {archivo && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Archivo seleccionado: <strong>{archivo.name}</strong> ({(archivo.size / 1024).toFixed(2)} KB)
              </Typography>
            )}

            {cargandoArchivo && <LinearProgress sx={{ mb: 2 }} />}

            {mensajeArchivo && (
              <Alert 
                severity={mensajeArchivo.includes('Error') || erroresArchivo.length > 0 ? 'error' : 'success'} 
                sx={{ mb: 2 }}
              >
                {mensajeArchivo}
              </Alert>
            )}

            {erroresArchivo.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Se encontraron {erroresArchivo.length} errores:
                </Typography>
                <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
                  {erroresArchivo.slice(0, 10).map((err, i) => (
                    <Typography key={i} variant="body2" component="li" sx={{ mb: 0.5 }}>
                      {err}
                    </Typography>
                  ))}
                  {erroresArchivo.length > 10 && (
                    <Typography variant="body2" component="li" sx={{ fontStyle: 'italic' }}>
                      ... y {erroresArchivo.length - 10} errores más
                    </Typography>
                  )}
                </Box>
              </Alert>
            )}
          </Paper>
        </TabPanel>
      </CardContent>
    </Card>
  )
}