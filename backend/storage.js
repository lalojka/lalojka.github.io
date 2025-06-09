const fs = require("fs");
const path = require("path");

const REPORTS_DIR = path.join(__dirname, "data", "ig_reports");

function getReportPath(ig_id) {
  return path.join(REPORTS_DIR, `${ig_id}.json`);
}

function leerHistorial(ig_id) {
  const file = getReportPath(ig_id);
  if (!fs.existsSync(file)) return { ig_id, reports: {} };
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function guardarHistorial(ig_id, data) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(getReportPath(ig_id), JSON.stringify(data, null, 2));
}

function agregarReporte(ig_id, report_type, snapshot) {
  const historial = leerHistorial(ig_id);
  if (!historial.reports[report_type]) historial.reports[report_type] = [];
  historial.reports[report_type].push(snapshot);
  guardarHistorial(ig_id, historial);
}

function getReportes(ig_id, report_type) {
  const historial = leerHistorial(ig_id);
  return historial.reports[report_type] || [];
}

module.exports = {
  agregarReporte,
  getReportes,
  leerHistorial,
  guardarHistorial
};