const appId = '493451440039423';

function statusChangeCallback(response) {
  const statusDiv = document.getElementById("status");
  if (response.status === 'connected') {
    sessionStorage.setItem('fb_access_token', response.authResponse.accessToken);
    statusDiv.textContent = "Ya has iniciado sesión.";
    getUserProfile();
  } else if (response.status === 'not_authorized') {
    statusDiv.textContent = "Por favor inicia sesión en esta app con Facebook.";
  } else {
    statusDiv.textContent = "Por favor inicia sesión en Facebook.";
  }
}

// HAZ ESTA FUNCIÓN GLOBAL para el botón oficial
window.checkLoginState = function() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
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

function getUserProfile() {
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

// Inicializar el SDK de Facebook
window.fbAsyncInit = function() {
  FB.init({
    appId      : appId,
    cookie     : true,
    xfbml      : true,
    version    : 'v22.0'
  });
  FB.AppEvents.logPageView();
  // Chequear estado al cargar la página
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// Cargar el SDK de Facebook de forma asíncrona (esto NO es inline)
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
