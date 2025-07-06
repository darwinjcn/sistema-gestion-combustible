"use client"

import { createTheme } from "@mui/material/styles"

// Paleta de colores basada en la página de bienvenida
const theme = createTheme({
  palette: {
    primary: {
      main: "#3498db", // Azul principal
      light: "#5dade2",
      dark: "#2980b9",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#667eea", // Púrpura del gradiente
      light: "#8e9aff",
      dark: "#4c63d2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#27ae60", // Verde
      light: "#58d68d",
      dark: "#229954",
    },
    error: {
      main: "#e74c3c", // Rojo
      light: "#f1948a",
      dark: "#c0392b",
    },
    warning: {
      main: "#f39c12", // Naranja
      light: "#f8c471",
      dark: "#e67e22",
    },
    info: {
      main: "#3498db",
      light: "#85c1e9",
      dark: "#2874a6",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#7f8c8d",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h4: {
      fontWeight: 600,
      color: "#2c3e50",
    },
    h5: {
      fontWeight: 600,
      color: "#2c3e50",
    },
    h6: {
      fontWeight: 600,
      color: "#2c3e50",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "10px 20px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8f9fa",
          "& .MuiTableCell-head": {
            fontWeight: 600,
            color: "#2c3e50",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
})

export default theme