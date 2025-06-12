// components/ListadoGeneradores.js

import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import axios from 'axios';

const ListadoGeneradores = () => {
  const [generadores, setGeneradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeneradores = async () => {
      try {
        // Usamos la ruta relativa porque tenemos proxy configurado
        const response = await axios.get('/api/generadores/');
        setGeneradores(response.data || []);
      } catch (err) {
        console.error("Error al obtener los generadores:", err.response?.data || err.message);
        setError("No se pudieron cargar los datos de los generadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchGeneradores();
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error)
    return (
      <p style={{ color: 'red' }}>{error}</p>
    );

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Modelo</TableCell>
            <TableCell>Capacidad (L)</TableCell>
            <TableCell>Nivel Actual (L)</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generadores.length > 0 ? (
            generadores.map((gen) => (
              <TableRow key={gen.id}>
                <TableCell>{gen.id}</TableCell>
                <TableCell>{gen.modelo}</TableCell>
                <TableCell>{gen.capacidad_tanque}</TableCell>
                <TableCell>{gen.nivel_actual || 'N/A'}</TableCell>
                <TableCell>
                  {gen.estado === 'activo' ? (
                    <span style={{ color: 'green' }}>✔️ Normal</span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Inactivo</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No hay datos disponibles o ocurrió un error.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListadoGeneradores;