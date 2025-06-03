import { getAccessToken, fetchFacebookAPI, clearAccessToken } from './auth.js';

export function main() {
  const userDiv = document.getElementById("user-info");
  const permissionsDiv = document.getElementById("permissions-info");
  const logoutBtn = document.getElementById("logout-btn");
  const reauthBtn = document.getElementById("reauth-btn");

  const accessToken = getAccessToken();

  if (!accessToken) {
    userDiv.textContent = "No access token found. Please log in again.";
    permissionsDiv.textContent = "";
    return;
  }

  // Fetch user data
  async function fetchUserInfo(token) {
    const fields = "id,name,email,picture";
    const url = `https://graph.facebook.com/v18.0/me?fields=${fields}&access_token=${token}`;
    return await fetchFacebookAPI(url);
  }

  // Fetch permissions
  async function fetchPermissions(token) {
    const url = `https://graph.facebook.com/v18.0/me/permissions?access_token=${token}`;
    return await fetchFacebookAPI(url);
  }

  // Render user info
  function renderUserInfo(user) {
    let html = '';
    if (user.picture && user.picture.data && user.picture.data.url) {
      html += `<img src="${user.picture.data.url}" alt="Profile picture" style="border-radius:50%;width:56px;height:56px;margin-bottom:8px;display:block;">`;
    }
    html += `<div><b>Name:</b> ${user.name || '(unknown)'}</div>`;
    if (user.email) {
      html += `<div><b>Email:</b> ${user.email}</div>`;
    }
    userDiv.innerHTML = html;
  }

  // Render permissions
  function renderPermissions(perms) {
    if (!perms || !perms.data || !perms.data.length) {
      permissionsDiv.textContent = "No permissions found.";
      return;
    }
    const granted = perms.data.filter(p => p.status === "granted");
    const declined = perms.data.filter(p => p.status === "declined");
    let html = "<ul>";
    granted.forEach(p => {
      html += `<li><b>${p.permission}</b> <span style="color:green;">(granted)</span></li>`;
    });
    declined.forEach(p => {
      html += `<li><b>${p.permission}</b> <span style="color:red;">(declined)</span></li>`;
    });
    html += "</ul>";
    permissionsDiv.innerHTML = html;
  }

  // Event handlers
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      clearAccessToken();
      location.href = "../index.html";
    };
  }

  if (reauthBtn) {
    reauthBtn.onclick = () => {
      clearAccessToken();
      // Redirect to your OAuth login flow
      location.href = "../index.html";
    };
  }

  // Main logic: fetch and render all info
  (async () => {
    userDiv.textContent = "Loading user data...";
    permissionsDiv.textContent = "Loading permissions...";
    try {
      const [user, perms] = await Promise.all([
        fetchUserInfo(accessToken),
        fetchPermissions(accessToken)
      ]);
      renderUserInfo(user);
      renderPermissions(perms);
    } catch (e) {
      userDiv.textContent = "Could not load user data.";
      permissionsDiv.textContent = "Could not load permissions.";
    }
  })();
}