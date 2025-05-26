const appId = '493451440039423';

function fbLogin() {
  // Wait for FB SDK to load
  if (typeof FB === "undefined") {
    alert("Facebook SDK no está cargado aún. Por favor espera.");
    return;
  }

  FB.login(function(response) {
    if (response.authResponse) {
      // User logged in and authorized
      const accessToken = response.authResponse.accessToken;
      sessionStorage.setItem("fb_access_token", accessToken);
      document.getElementById("status").textContent = "Login exitoso!";
      getUserProfile(); // fetch user profile after login
    } else {
      document.getElementById("status").textContent = "Login cancelado o no autorizado.";
    }
  }, {scope: "public_profile,email"});
}

async function getUserProfile() {
  const token = sessionStorage.getItem("fb_access_token");
  if (!token) {
    alert("No estás logueado");
    return;
  }

  // You can use FB.api or fetch
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

// Optionally: auto check login status on page load
window.checkLoginState = function() {
  if (typeof FB === "undefined") return;
  FB.getLoginStatus(function(response) {
    if (response.status === "connected") {
      sessionStorage.setItem("fb_access_token", response.authResponse.accessToken);
      document.getElementById("status").textContent = "Ya has iniciado sesión.";
      getUserProfile();
    }
  });
};

// Check login state when FB SDK is ready
window.fbAsyncInit = function() {
  FB.init({
    appId      : appId,
    cookie     : true,
    xfbml      : true,
    version    : 'v19.0'
  });
  FB.AppEvents.logPageView();
  window.checkLoginState();
};
