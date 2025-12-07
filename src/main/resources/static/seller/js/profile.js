const API_BASE_URL = "http://localhost:8080";
let currentUserId = null;

document.addEventListener("DOMContentLoaded", async function () {
  // 1. Check Session
  const userRaw = sessionStorage.getItem("loggedInUser");
  if (!userRaw) {
    window.location.href = '../user/index.html';
    return;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch (e) {
    window.location.href = '../user/index.html';
    return;
  }
  currentUserId = user.id;

  // 2. Setup UI Elements
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const profilePhone = document.getElementById("profilePhone");
  const profileCampus = document.getElementById("profileCampus");

  // Form elements (for the edit modal)
  const editPhone = document.getElementById("editPhone");
  const editCampus = document.getElementById("editCampus");

  // 3. Load Data from Backend
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`);

    if (response.ok) {
        const backendUser = await response.json();

        // Fill Profile Display
        if(profileName) profileName.textContent = backendUser.username;
        if(profileRole) profileRole.textContent = "Seller";
        if(profilePhone) profilePhone.textContent = backendUser.phoneNumber || "Not set";
        if(profileCampus) profileCampus.textContent = backendUser.campus || "Not set";

        // Fill Edit Form Inputs
        if(editPhone) editPhone.value = backendUser.phoneNumber || "";
        if(editCampus) editCampus.value = backendUser.campus || "";
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  }
});

// --- GLOBAL FUNCTIONS (Must be outside DOMContentLoaded) ---

async function saveProfileChanges() {
  // Use the ID we stored globally or fetch from session again
  const userRaw = sessionStorage.getItem("loggedInUser");
  if (!userRaw) return;
  const user = JSON.parse(userRaw);

  const newPhone = document.getElementById("editPhone").value;
  const newCampus = document.getElementById("editCampus").value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber: newPhone, campus: newCampus }),
    });

    if (response.ok) {
      alert("Profile Updated Successfully!");
      location.reload();
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
  window.location.href = "../user/index.html";
}