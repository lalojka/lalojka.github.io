const appId = '493451440039423';

function statusChangeCallback(response) {
  const statusDiv = document.getElementById("status");
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    sessionStorage.setItem('fb_access_token', response.authResponse.accessToken);
    statusDiv.textContent = "Ya has iniciado sesión.";
    getUserProfile();
  } else if (response.status === 'not_authorized') {
    // Logged into Facebook, but not your app
    statusDiv.textContent = "Por favor inicia sesión en esta app con Facebook.";
  } else {
    // Not logged into Facebook
    statusDiv.textContent = "Por favor inicia sesión en Facebook.";
  }
}

function fbLogin() {
  if (typeof FB === "undefined") {
    alert("Facebook SDK no está cargado aún. Por favor espera.");
    return;
  }
  FB.login(function(response) {
    statusChangeCallback(response);
  }, {scope: "public_profile,email"});
}

async function getUserProfile() {
  const token = sessionStorage.getItem("fb_access_token");
  if (!token) {
    alert("No estás logueado");
    return;
  }
  FB.api('/me', {fields: 'id,name,email'}, function(response) {
    if (response && !response.error) {
      alert(`Hola ${response.name || "no disponible"}`);
      console.log(response);
    } else {
      alert("Error obteniendo perfil.");
      console.error(response.error);
    }
  });
}

// FB SDK will call window.fbAsyncInit when loaded
window.fbAsyncInit = function() {
  FB.init({
    appId      : appId,
    cookie     : true,
    xfbml      : true,
    version    : 'v19.0'
  });
  FB.AppEvents.logPageView();
  // Check login status on page load!
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
