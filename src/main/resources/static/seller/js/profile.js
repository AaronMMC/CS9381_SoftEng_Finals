const API_BASE_URL = ""; // same origin
let currentUserId = null;

document.addEventListener("DOMContentLoaded", async function () {
  const sessionUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!sessionUser) {
    window.location.href = '../user/index.html';
    return;
  }
  currentUserId = sessionUser.id;

  await loadProfileData();
});

async function loadProfileData() {
  try {
    const response = await fetch(`/api/users/${currentUserId}`);
    if (response.ok) {
      const user = await response.json();

      document.getElementById("profileName").textContent = user.username;

      const role = user.role ? user.role.toLowerCase() : "user";
      document.getElementById("profileRole").textContent = role.charAt(0).toUpperCase() + role.slice(1);

      document.getElementById("profilePhone").textContent = user.phoneNumber || "Not set";
      document.getElementById("profileCampus").textContent = user.campus || "Not set";

      document.getElementById("editPhone").value = user.phoneNumber || "";
      document.getElementById("editCampus").value = user.campus || "SLU Mary Heights Campus";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

async function saveProfileChanges() {
  const newPhone = document.getElementById("editPhone").value;
  const newCampus = document.getElementById("editCampus").value;

  const payload = { phoneNumber: newPhone, campus: newCampus };

  try {
    const response = await fetch(`/api/users/${currentUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const modalEl = document.getElementById("editProfileModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance.hide();

      await loadProfileData();
      alert("Profile Updated Successfully!");
    } else {
      alert("Failed to update profile.");
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("Server error.");
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = '../user/index.html';
}
document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  const usernameInput = document.getElementById('username');
  const phoneInput = document.getElementById('phone');
  const campusInput = document.getElementById('campus');
  const logoutBtn = document.getElementById('logoutBtn');

  const userRaw = sessionStorage.getItem('loggedInUser');
  if (!userRaw) { window.location.href = '../user/index.html'; return; }
  let user;
  try { user = JSON.parse(userRaw); } catch { window.location.href = '../user/index.html'; return; }

  usernameInput.value = user.username || '';
  phoneInput.value = user.phoneNumber || user.phone_number || '';
  campusInput.value = user.campus || '';

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // lightweight UI-only update; backend user update endpoint not currently implemented
    user.phoneNumber = phoneInput.value;
    user.campus = campusInput.value;
    sessionStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Profile updated locally. Server update not implemented.');
  });

  logoutBtn.addEventListener('click', () => { sessionStorage.clear(); window.location.href = '../user/index.html'; });
});
