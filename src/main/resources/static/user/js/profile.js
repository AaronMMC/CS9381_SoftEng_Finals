const API_BASE_URL = "http://localhost:8080";
let currentUserId = null;

document.addEventListener("DOMContentLoaded", async function() {
    // 1. Get User from Session
    const sessionUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!sessionUser) {
        // Redirect to Login if session is empty
        window.location.href = "/index.html";
        return;
    }
    currentUserId = sessionUser.id;

    // 2. Fetch fresh data
    await loadProfileData();
});

async function loadProfileData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${currentUserId}`);
        if (response.ok) {
            const user = await response.json();

            // Populate View
            document.getElementById("profileName").textContent = user.username;

            // Format Role
            const role = user.role ? user.role.toLowerCase() : "user";
            document.getElementById("profileRole").textContent = role.charAt(0).toUpperCase() + role.slice(1);

            // Populate Details (NO EMAIL HERE)
            document.getElementById("profilePhone").textContent = user.phoneNumber || "Not set";
            document.getElementById("profileCampus").textContent = user.campus || "Not set";

            // Populate Edit Modal Inputs
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

    const payload = {
        phoneNumber: newPhone,
        campus: newCampus
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${currentUserId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Close Modal
            const modalEl = document.getElementById('editProfileModal');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();

            // Refresh Data
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

// --- LOGOUT FUNCTION FIXED ---
function logout() {
    // 1. Clear Session
    sessionStorage.clear();

    // 2. Redirect to Root (Login Page)
    // Using "/" ensures it goes to http://localhost:8080/index.html
    // regardless of which folder you are currently in.
    window.location.href = "/CS9381_SoftEng_Finals/static/user/index.html";
}