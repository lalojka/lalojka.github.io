const fs = require("fs");
const path = require("path");
const { createSession } = require("./authSessions");

const USERS_DIR = path.join(__dirname, "data", "users");
const USERS_PATH = path.join(USERS_DIR, "users.json");

// Garantiza que existen carpeta y archivo
function ensureUsersFile() {
  if (!fs.existsSync(USERS_DIR)) fs.mkdirSync(USERS_DIR, { recursive: true });
  if (!fs.existsSync(USERS_PATH)) fs.writeFileSync(USERS_PATH, "[]");
}

function leerUsuarios() {
  ensureUsersFile();
  return JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
}

function guardarUsuarios(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

module.exports = {
  login: (req, res) => {
    const {
      fb_id, fb_email, fb_name, fb_picture, accessToken,
      ig_id, ig_username, ig_name, ig_picture
    } = req.body;

    if (!fb_id || !fb_email || !fb_name) {
      return res.status(400).json({ ok: false, error: "Faltan datos obligatorios de Facebook" });
    }

    ensureUsersFile();
    let users = leerUsuarios();
    let idx = users.findIndex(u => u.fb_id === fb_id);
    const userData = {
      fb_id, fb_email, fb_name, fb_picture, accessToken,
      ig_id, ig_username, ig_name, ig_picture
    };

    if (idx !== -1) {
      // Actualiza datos si el usuario ya existe
      users[idx] = { ...users[idx], ...userData };
    } else {
      // Agrega nuevo usuario
      users.push(userData);
    }
    guardarUsuarios(users);

    // Crear sesión segura y setear cookie httpOnly
    const sessionToken = createSession(fb_id);
    res.cookie('epm_session', sessionToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: true // Cambia a true si usas HTTPS en producción
    });

    res.json({ ok: true, user: userData });
  }
};