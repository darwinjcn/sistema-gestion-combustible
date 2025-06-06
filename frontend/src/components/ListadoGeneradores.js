// components/ListadoGeneradores.js
import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ListadoGeneradores = () => {
  const [generadores, setGeneradores] = useState([]);

  useEffect(() => {
    const fetchGeneradores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/generadores/');
        setGeneradores(response.data);
      } catch (error) {
        console.error("Error al obtener los generadores:", error);
      }
    };

    fetchGeneradores();
  }, []);

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table aria-label="simple table">
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
                  Cargando datos...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ListadoGeneradores;