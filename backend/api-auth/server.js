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

// Endpoint para guardar (o actualizar) usuario con datos de Facebook + Instagram
app.post("/api/auth/login", (req, res) => {
  console.log("POST /api/auth/login recibido:", req.body);

  const {
    fb_id, fb_email, fb_name, fb_picture, accessToken,
    ig_id, ig_username, ig_name, ig_picture
  } = req.body;

  if (!fb_id || !accessToken) {
    console.log("Solicitud inválida, faltan datos.");
    return res.status(400).json({ ok: false, error: "Faltan datos" });
  }
  let usuarios = leerUsuarios();
  let user = usuarios.find(u => u.fb_id === fb_id);

  if (user) {
    // Actualizar datos existentes
    user.fb_email = fb_email || user.fb_email;
    user.fb_name = fb_name || user.fb_name;
    user.fb_picture = fb_picture || user.fb_picture;
    user.accessToken = accessToken;
    user.ig_id = ig_id || user.ig_id;
    user.ig_username = ig_username || user.ig_username;
    user.ig_name = ig_name || user.ig_name;
    user.ig_picture = ig_picture || user.ig_picture;
  } else {
    user = {
      fb_id, fb_email, fb_name, fb_picture, accessToken,
      ig_id, ig_username, ig_name, ig_picture
    };
    usuarios.push(user);
  }
  guardarUsuarios(usuarios);
  console.log("Usuario+Instagram guardado/actualizado:", user);
  res.json({ ok: true });
});

app.get("/api/auth/user/:fb_id", (req, res) => {
  const usuarios = leerUsuarios();
  const user = usuarios.find(u => u.fb_id === req.params.fb_id);
  if (!user) return res.status(404).json({ ok: false });
  res.json({ ok: true, user });
});

app.listen(PORT, () => {
  console.log(`API Auth corriendo en http://localhost:${PORT}`);
});