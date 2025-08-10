// Evita errores cuando value no es numérico
export function safeFixed(value, digits = 2) {
  const num = Number(value)
  if (!Number.isFinite(num)) return (0).toFixed(digits)
  return num.toFixed(digits)
}