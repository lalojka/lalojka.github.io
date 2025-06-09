const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: permite llamadas desde frontend local y producción
app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://lalojka.github.io",
    "https://app.epm-marketing.com"
  ],
  credentials: true,
}));
app.use(express.json());

const USUARIOS_PATH = path.join(__dirname, "data", "usuarios.json");

// Helpers para leer y guardar usuarios
function leerUsuarios() {
  try {
    return JSON.parse(fs.readFileSync(USUARIOS_PATH, "utf-8"));
  } catch {
    return [];
  }
}
function guardarUsuarios(usuarios) {
  fs.writeFileSync(USUARIOS_PATH, JSON.stringify(usuarios, null, 2));
}

// Endpoint para guardar (o actualizar) usuario
app.post("/api/auth/login", (req, res) => {
  console.log("POST /api/auth/login recibido:", req.body); // Debug
  const { id, email, nombre, accessToken, instagram_id } = req.body;
  if (!id || !accessToken) {
    console.log("Solicitud inválida, faltan datos.");
    return res.status(400).json({ ok: false, error: "Faltan datos" });
  }
  let usuarios = leerUsuarios();
  let user = usuarios.find(u => u.id === id);
  if (user) {
    user.email = email || user.email;
    user.nombre = nombre || user.nombre;
    user.accessToken = accessToken;
    user.instagram_id = instagram_id || user.instagram_id;
  } else {
    user = { id, email, nombre, accessToken, instagram_id };
    usuarios.push(user);
  }
  guardarUsuarios(usuarios);
  console.log("Usuario guardado/actualizado:", user);
  res.json({ ok: true });
});

app.get("/api/auth/user/:id", (req, res) => {
  const usuarios = leerUsuarios();
  const user = usuarios.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ ok: false });
  res.json({ ok: true, user });
});

app.listen(PORT, () => {
  console.log(`API Auth corriendo en http://localhost:${PORT}`);
});