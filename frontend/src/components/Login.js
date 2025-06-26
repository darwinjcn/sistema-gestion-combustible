// components/Login.js

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario || !contraseña) {
      setError("Por favor completa ambos campos.");
      return;
    }

    try {
      const response = await axios.post('/api/login/', {
        username: usuario,
        password: contraseña
      });

      localStorage.setItem('token', response.data.token);
      setExito(true);
    } catch (err) {
      setError("Credenciales incorrectas o servidor no disponible.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Iniciar Sesión</Typography>

      {exito ? (
        <Alert severity="success">✅ Sesión iniciada</Alert>
      ) : (
        <>
          <TextField
            label="Usuario"
            type="text"
            fullWidth
            margin="normal"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />

          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            Iniciar Sesión
          </Button>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </>
      )}
    </Box>
  );
};

export default Login;