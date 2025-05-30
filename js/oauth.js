const appId = '493451440039423';

function statusChangeCallback(response) {
  const statusDiv = document.getElementById("status");
  if (response.status === 'connected') {
    // Usuario logueado en tu app y en Facebook
    sessionStorage.setItem('fb_access_token', response.authResponse.accessToken);
    statusDiv.textContent = "You are logged in.";
    getUserProfile(); // Ahora, esta función hará el redirect.
  } else if (response.status === 'not_authorized') {
    // Logueado en Facebook, pero no en tu app
    statusDiv.textContent = "Por favor inicia sesión en esta app con Facebook.";
  } else {
    // No logueado en Facebook
    statusDiv.textContent = "Por favor inicia sesión en Facebook.";
  }
}

// Make this function global for the official button to call
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

async function getUserProfile() {
  const token = sessionStorage.getItem("fb_access_token");
  if (!token) {
    alert("You are not logged in.");
    return;
  }
  // Pedimos también el nombre
  FB.api('/me', {fields: 'id,name,email'}, function(response) {
    if (response && !response.error) {
      // Guarda el nombre en sessionStorage para mostrarlo en /logged/
      sessionStorage.setItem("fb_name", response.email || "");
      // Redirige a /logged/
      window.location.href = "/logged/";
    } else {
      alert("Error retrieving profile.");
      console.error(response.error);
    }
  });
}

// Initialize the Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId      : appId,
    cookie     : true,
    xfbml      : true,
    version    : 'v22.0'
  });
  FB.AppEvents.logPageView();
  // Optionally, check login status when the page loads
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
