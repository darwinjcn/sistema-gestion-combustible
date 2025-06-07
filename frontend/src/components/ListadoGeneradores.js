// components/ListadoGeneradores.js

import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const ListadoGeneradores = () => {
  const [generadores, setGeneradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeneradores = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/generadores/');
        setGeneradores(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los generadores:", err);
        setError("No se pudieron cargar los datos de los generadores.");
        setLoading(false);
      }
    };

    fetchGeneradores();
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
                  {gen.nivel_actual < 300 && gen.nivel_actual !== null ? (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Bajo</span>
                  ) : (
                    <span style={{ color: 'green' }}>✔️ Normal</span>
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