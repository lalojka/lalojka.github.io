const crypto = require("crypto");

// En producción deberías usar Redis u otra DB, pero para desarrollo usamos memoria RAM.
const sessions = new Map(); // sessionToken => fb_id

/**
 * Crea una sesión segura para el usuario y devuelve el token de sesión.
 * @param {string} fb_id
 * @returns {string} sessionToken
 */
function createSession(fb_id) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  sessions.set(sessionToken, fb_id);
  return sessionToken;
}

/**
 * Obtiene el fb_id asociado a un sessionToken. Si no existe, devuelve undefined.
 * @param {string} sessionToken
 * @returns {string|undefined}
 */
function getFbIdFromSession(sessionToken) {
  return sessions.get(sessionToken);
}

/**
 * Elimina la sesión (logout).
 * @param {string} sessionToken
 */
function deleteSession(sessionToken) {
  sessions.delete(sessionToken);
}

module.exports = { createSession, getFbIdFromSession, deleteSession };