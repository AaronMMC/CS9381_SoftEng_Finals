const API_BASE_URL = "http://localhost:8080";

// --- UTILITY: Toggle Password Visibility ---
function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// --- LOGIC: LOGIN PAGE ---
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Stop page refresh

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const messageArea = document.getElementById('messageArea');

        // UI: Show loading state
        messageArea.textContent = "Verifying...";
        messageArea.className = "mt-3 text-muted";

        // JSON Payload (Matches AuthRequest.java)
        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        try {
            // POST /api/auth/login
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const user = await response.json();

                // UI: Success
                messageArea.textContent = `Success! Welcome ${user.username}`;
                messageArea.className = "mt-3 text-success";

                // Save user info (so other pages know who is logged in)
                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                // Redirect logic based on Role
                setTimeout(() => {
                    if (user.role === 'SELLER') {
                        window.location.href = "seller-dashboard.html";
                    } else if (user.role === 'ADMIN') {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        // Default for CUSTOMER
                        window.location.href = "dashboard.html";
                    }
                }, 1000);

            } else {
                // UI: Error (Backend threw RuntimeException)
                // "Login Failed: Invalid password" comes here
                const errorText = await response.text();

                // Clean up error message if it's too technical
                let displayError = "Invalid credentials.";
                if (errorText.includes("Login Failed")) {
                    // Extract just the message part if possible
                    displayError = "Login failed. Please check your password.";
                }

                messageArea.textContent = displayError;
                messageArea.className = "mt-3 text-danger";
            }
        } catch (error) {
            console.error(error);
            messageArea.textContent = "Server is offline or not responding.";
            messageArea.className = "mt-3 text-danger";
        }
    });
}

// --- LOGIC: REGISTER PAGE ---
const registerForm = document.getElementById('registerForm');
const sellerToggle = document.getElementById('sellerToggle');
const canteenField = document.getElementById('canteenField');

// 1. Toggle Canteen Input Visibility (UI Only)
if (sellerToggle) {
    sellerToggle.addEventListener('change', function() {
        if (this.checked) {
            canteenField.classList.remove('d-none'); // Show input
            document.getElementById('canteenName').setAttribute('required', 'true');
        } else {
            canteenField.classList.add('d-none'); // Hide input
            document.getElementById('canteenName').removeAttribute('required');
        }
    });
}

// 2. Handle Registration Submit
if (registerForm) {
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        // NEW FIELDS
        const phone = document.getElementById('phoneNumber').value;
        const campus = document.getElementById('campusSelect').value;

        const isSeller = document.getElementById('sellerToggle').checked;
        const canteenName = document.getElementById('canteenName').value;
        const messageArea = document.getElementById('regMessageArea');

        if (password !== confirmPass) {
            messageArea.textContent = "Passwords do not match!";
            messageArea.className = "mt-3 text-danger";
            return;
        }

        let endpoint = "/api/auth/register/customer";

        // ADD NEW FIELDS TO PAYLOAD (Base Payload)
        let payload = {
            username: username,
            password: password,
            phoneNumber: phone,  // Send phone
            campus: campus       // Send campus
        };

        if (isSeller) {
            endpoint = "/api/auth/register/seller";

            // FIX: We must include the phone and campus here as well!
            // We use the spread operator (...) to keep the existing fields
            // and simply add the canteenName to it.
            payload = {
                ...payload, // Copies username, password, phoneNumber, campus
                canteenName: canteenName
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                messageArea.textContent = isSeller
                    ? "Application Sent! Please wait for Admin approval."
                    : "Account created! Redirecting...";

                messageArea.className = "mt-3 text-success";
                setTimeout(() => window.location.href = "index.html", 2000);
            } else {
                const error = await response.text();
                messageArea.textContent = "Registration failed.";
                messageArea.className = "mt-3 text-danger";
            }
        } catch (error) {
            messageArea.textContent = "Server error.";
            messageArea.className = "mt-3 text-danger";
        }
    });
}