import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Paper
} from '@mui/material';
import axios from 'axios';

// Configurar axios (igual que en los otros componentes)
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const CargaMasiva = () => {
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState([]);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
    setMensaje('');
    setErrores([]);
  };

  const handleUpload = async () => {
    if (!archivo) {
      setMensaje('Por favor selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', archivo);

    setCargando(true);
    setMensaje('');
    setErrores([]);

    try {
      // URL corregida según la estructura establecida
      const response = await axios.post('/api/combustible_api/carga-masiva/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMensaje(response.data.mensaje);
      if (response.data.errores && response.data.errores.length > 0) {
        setErrores(response.data.errores);
      }

    } catch (err) {
      console.error('Error en carga masiva:', err);
      
      let errorMsg = 'Error desconocido al subir el archivo.';
      
      if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Archivo inválido o datos incorrectos.';
      } else if (err.response?.status === 401) {
        errorMsg = 'No autorizado. Verifica tu sesión.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Error del servidor. Verifica que Django esté funcionando.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'No se puede conectar con el servidor en localhost:8000.';
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      
      setMensaje(`❌ Error: ${errorMsg}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
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
          disabled={!archivo || cargando}
          sx={{ minWidth: '120px' }}
        >
          {cargando ? 'Cargando...' : 'Subir Archivo'}
        </Button>
      </Box>

      {archivo && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Archivo seleccionado: <strong>{archivo.name}</strong> ({(archivo.size / 1024).toFixed(2)} KB)
        </Typography>
      )}

      {cargando && <LinearProgress sx={{ mb: 2 }} />}

      {mensaje && (
        <Alert 
          severity={mensaje.includes('Error') || errores.length > 0 ? 'error' : 'success'} 
          sx={{ mb: 2 }}
        >
          {mensaje}
        </Alert>
      )}

      {errores.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Se encontraron {errores.length} errores:
          </Typography>
          <Box component="ul" sx={{ margin: 0, paddingLeft: 2 }}>
            {errores.slice(0, 10).map((err, i) => (
              <Typography key={i} variant="body2" component="li" sx={{ mb: 0.5 }}>
                {err}
              </Typography>
            ))}
            {errores.length > 10 && (
              <Typography variant="body2" component="li" sx={{ fontStyle: 'italic' }}>
                ... y {errores.length - 10} errores más
              </Typography>
            )}
          </Box>
        </Alert>
      )}
    </Paper>
  );
};

export default CargaMasiva;