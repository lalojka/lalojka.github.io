const express = require("express");
const cors = require("cors");
const { login } = require("./auth"); // <--- IMPORTANTE
const { getInstagramMedia } = require("./facebook");

const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// --- AUTH ---
app.post("/api/auth/login", login);

// 1. Endpoint para productos principales
app.get("/api/productos", (req, res) => {
  res.json({
    ok: true,
    productos: [
      { id: "reportes", nombre: "Reportes" },
      { id: "mentoria", nombre: "Mentoría" },
      { id: "estrategia", nombre: "Estrategia de contenido" },
      { id: "configuracion", nombre: "Configuración" }
    ]
  });
});

// 2. Endpoint para tipos de reportes
app.get("/api/reportes/tipos", (req, res) => {
  res.json({
    ok: true,
    tipos: [
      { id: "media", nombre: "Publicaciones" },
      { id: "stories", nombre: "Stories" },
      { id: "crecimiento", nombre: "Crecimiento de seguidores" }
    ]
  });
});

// 3. Endpoint para obtener el reporte específico
app.get("/api/reportes/:ig_id/:tipo", async (req, res) => {
  const { ig_id, tipo } = req.params;
  const accessToken = req.query.accessToken;
  if (!accessToken) return res.status(400).json({ ok: false, error: "Falta accessToken" });

  try {
    if (tipo === "media") {
      const data = await getInstagramMedia(ig_id, accessToken);
      return res.json({ ok: true, data });
    }
    // if (tipo === "stories") { ... }
    // if (tipo === "crecimiento") { ... }
    return res.status(400).json({ ok: false, error: "Tipo de reporte no soportado aún." });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 4. Endpoints para otros productos (ejemplo vacío)
app.get("/api/mentoria", (req, res) => {
  res.json({ ok: true, mensaje: "Aquí va la lógica de mentoria" });
});
app.get("/api/estrategia", (req, res) => {
  res.json({ ok: true, mensaje: "Aquí va la lógica de estrategia de contenido" });
});
app.get("/api/configuracion", (req, res) => {
  res.json({ ok: true, mensaje: "Aquí va la lógica de configuración" });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Backend corriendo en http://localhost:" + (process.env.PORT || 4000));
});