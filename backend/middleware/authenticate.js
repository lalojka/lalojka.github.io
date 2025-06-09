const fs = require("fs");
const path = require("path");
const { getFbIdFromSession } = require("../authSessions");
const USERS_PATH = path.join(__dirname, "../data/users/users.json");

function authenticate(req, res, next) {
  // 1. Extraer el token de cookie
  const sessionToken = req.cookies.epm_session;
  if (!sessionToken) {
    return res.status(401).json({ ok: false, error: "No session" });
  }

  // 2. Verificar validez del token (en memoria)
  const fb_id = getFbIdFromSession(sessionToken);
  if (!fb_id) {
    return res.status(403).json({ ok: false, error: "Invalid session" });
  }

  // 3. Buscar usuario en el archivo
  let users;
  try {
    users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Error leyendo usuarios" });
  }
  const user = users.find(u => u.fb_id === fb_id);

  if (!user) {
    return res.status(403).json({ ok: false, error: "User not found" });
  }

  // 4. Validar que el ig_id de la request pertenece al usuario
  const ig_id = req.params.ig_id;
  if (ig_id && user.ig_id !== ig_id) {
    return res.status(403).json({ ok: false, error: "No autorizado para esta cuenta IG" });
  }

  // 5. Si todo OK, adjuntar user al request y continuar
  req.user = user;
  next();
}

module.exports = authenticate;