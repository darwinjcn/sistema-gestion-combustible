"use client"

import { Button, Tooltip } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"

export default function LogoutButton() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (!token) return null

  const onLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <Tooltip title="Cerrar sesión" placement="left">
      <Button
        variant="contained"
        color="error"
        onClick={onLogout}
        startIcon={<LogoutIcon />}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 16,
          zIndex: 1300,
          borderRadius: 999,
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        }}
      >
        Cerrar sesión
      </Button>
    </Tooltip>
  )
}