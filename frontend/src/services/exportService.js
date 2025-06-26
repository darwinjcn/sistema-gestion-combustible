// services/exportService.js

import * as XLSX from 'exceljs';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : {};
pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};

// Exportar a Excel
export const exportToExcel = (data, desde, hasta) => {
  const workbook = new XLSX.Workbook();
  const worksheet = workbook.addWorksheet('Consumos');

  // Encabezados
  worksheet.columns = [
    { header: 'Fecha', key: 'fecha', width: 20 },
    { header: 'Generador ID', key: 'generador', width: 15 },
    { header: 'Nivel Actual (L)', key: 'nivel_actual', width: 15 },
    { header: 'Consumo (L)', key: 'consumo', width: 15 },
  ];

  // Filas
  data.forEach(item => {
    worksheet.addRow({
      fecha: item.fecha.slice(0, 10),
      generador: item.generador,
      nivel_actual: item.nivel_actual,
      consumo: item.consumo
    });
  });

  // Descargar archivo
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `reporte_consumo_${desde || 'inicio'}_${hasta || 'fin'}.xlsx`);
  });
};


// Exportar a PDF
export const exportToPDF = (data, desde, hasta) => {
  const body = data.map(item => [
    item.fecha.slice(0, 10),
    item.generador,
    item.nivel_actual,
    item.consumo
  ]);

  const docDefinition = {
    content: [
      { text: 'Reporte Técnico de Consumo de Combustible\n\n', fontSize: 18, alignment: 'center' },
      {
        table: {
          headers: ['Fecha', 'Generador ID', 'Nivel Actual (L)', 'Consumo (L)'],
          body: [
            ['Fecha', 'Generador ID', 'Nivel Actual (L)', 'Consumo (L)'],
            ...body
          ]
        }
      }
    ],
    defaultStyle: {
      font: 'Roboto'
    }
  };

  pdfMake.createPdf(docDefinition).download(`reporte_consumo_${desde || 'inicio'}_${hasta || 'fin'}.pdf`);
};