// frontend/src/services/api.js
import axios from "axios"

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error)

    if (error.code === "ECONNREFUSED") {
      console.error("🔴 No se puede conectar con el servidor Django")
      console.error("Verifica que Django esté ejecutándose en http://localhost:8000")
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default api