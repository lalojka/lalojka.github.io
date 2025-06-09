const fetch = require("node-fetch");

async function getInstagramMedia(igBusinessId, accessToken, fields) {
  const url = `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=${fields}&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("FB API error: " + res.status);
  return await res.json();
}

module.exports = { getInstagramMedia };