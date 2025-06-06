// components/ListadoGeneradores.js
import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const listado = [
  { id: 1, modelo: "Gen-Modelo A", capacidad: 1000, nivel: 750 },
  { id: 2, modelo: "Gen-Modelo B", capacidad: 800, nivel: 200 },
];

const ListadoGeneradores = () => {
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
          {listado.map((gen) => (
            <TableRow key={gen.id}>
              <TableCell>{gen.id}</TableCell>
              <TableCell>{gen.modelo}</TableCell>
              <TableCell>{gen.capacidad}</TableCell>
              <TableCell>{gen.nivel}</TableCell>
              <TableCell>
                {gen.nivel < 300 ? (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Bajo</span>
                ) : (
                  <span style={{ color: 'green' }}>✔️ Normal</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListadoGeneradores;