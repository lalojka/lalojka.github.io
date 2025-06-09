const fs = require("fs");
const path = require("path");
const { getFbIdFromSession } = require("../authSessions");
const USERS_PATH = path.join(__dirname, "../data/users/users.json");

function authenticate(req, res, next) {
  const sessionToken = req.cookies.epm_session;
  if (!sessionToken) {
    return res.status(401).json({ ok: false, error: "No session" });
  }

  const fb_id = getFbIdFromSession(sessionToken);
  if (!fb_id) {
    return res.status(403).json({ ok: false, error: "Invalid session" });
  }

  const users = JSON.parse(fs.readFileSync(USERS_PATH, "utf-8"));
  const user = users.find(u => u.fb_id === fb_id);

  if (!user) {
    return res.status(403).json({ ok: false, error: "User not found" });
  }

  // Validar que el ig_id de la request pertenece al usuario
  const ig_id = req.params.ig_id;
  if (ig_id && user.ig_id !== ig_id) {
    return res.status(403).json({ ok: false, error: "No autorizado para esta cuenta IG" });
  }

  req.user = user;
  next();
}

module.exports = authenticate;