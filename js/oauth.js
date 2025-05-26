const appId = "493451440039423";
const redirectUri = "https://app.epm-marketing.com/redirect.html";

function oauthLogin() {
  const fbAuthUrl = `https://www.facebook.com/v17.0/dialog/oauth?` +
    `client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=public_profile`;

  window.location = fbAuthUrl;
}

function parseAccessTokenFromHash() {
  const hash = window.location.hash.substr(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

async function getUserProfile() {
  const token = sessionStorage.getItem("fb_access_token");
  if (!token) {
    alert("No estás logueado");
    return;
  }

  const res = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name`);
  const data = await res.json();
  console.log(data);
  alert(`Hola ${data.name} || "no disponible"}`);
}
