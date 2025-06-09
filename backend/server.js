const express = require("express");
const cors = require("cors");
const { login } = require("./auth");
const { getInstagramMedia } = require("./facebook");
const cookieParser = require("cookie-parser");
const authenticate = require("./middleware/authenticate");

const app = express();
app.use(cors({
  origin: "http://https://lalojka.github.io", // Cambia según tu front
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

// 3. Endpoint SEGURO para obtener el reporte específico de insights
app.get("/api/reportes/:ig_id/insights", authenticate, async (req, res) => {
  const { ig_id } = req.params;
  const user = req.user;

  // Validación ya hecha por el middleware
  try {
    // Aquí tu código real de fetch a Instagram Graph API, usando user.accessToken
    // Ejemplo:
    // const insights = await fetchInstagramInsightsForDay(user.ig_id, user.accessToken, ...);

    res.json({
      ok: true,
      mensaje: "¡Validación OK! (Aquí deberías ver los insights reales)",
      // insights
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 3b. Plantilla para otros reportes (puedes expandir esto con más lógica)
app.get("/api/reportes/:ig_id/:tipo", authenticate, async (req, res) => {
  const { ig_id, tipo } = req.params;
  const user = req.user;

  try {
    if (tipo === "media") {
      const data = await getInstagramMedia(ig_id, user.accessToken);
      return res.json({ ok: true, data });
    }
    // Agrega aquí otros tipos (stories, crecimiento, etc.)
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