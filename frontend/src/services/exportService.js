// services/exportService.js

import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function normalizeRow(row) {
  return {
    id: row.id ?? "",
    generador:
      typeof row.generador === "object" ? (row.generador?.modelo ?? row.generador?.id ?? "") : (row.generador ?? ""),
    fecha: row.fecha ?? "",
    consumo: row.consumo ?? 0,
    nivel_actual: row.nivel_actual ?? 0,
  }
}

export function exportToExcel(datos = [], desde = "", hasta = "") {
  const rows = (Array.isArray(datos) ? datos : []).map(normalizeRow)
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Consumos")
  const name = `reporte_consumo_${desde || "inicio"}_${hasta || "fin"}.xlsx`
  XLSX.writeFile(wb, name)
}

export function exportToPDF(datos = [], desde = "", hasta = "") {
  const rows = (Array.isArray(datos) ? datos : []).map(normalizeRow)
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  doc.setFontSize(16)
  doc.text("Reporte de Consumos", 40, 40)
  doc.setFontSize(10)
  doc.text(`Rango: ${desde || "Inicio"} — ${hasta || "Fin"}`, 40, 60)

  autoTable(doc, {
    startY: 80,
    styles: { fontSize: 9 },
    head: [["ID", "Generador", "Fecha", "Consumo (L)", "Nivel Actual (L)"]],
    body: rows.map((r) => [r.id, String(r.generador), String(r.fecha), String(r.consumo), String(r.nivel_actual)]),
  })

  const name = `reporte_consumo_${desde || "inicio"}_${hasta || "fin"}.pdf`
  doc.save(name)
}