const API_BASE_URL = "http://localhost:8080";

function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const messageArea = document.getElementById('messageArea');

        messageArea.textContent = "Verifying...";
        messageArea.className = "mt-3 text-muted";

        const payload = {
            username: usernameInput,
            password: passwordInput
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const user = await response.json();

                messageArea.textContent = `Success! Welcome ${user.username}`;
                messageArea.className = "mt-3 text-success";

                sessionStorage.setItem("loggedInUser", JSON.stringify(user));

                setTimeout(() => {
                    if (user.role === 'SELLER') {
                        window.location.href = "seller-dashboard.html";
                    } else if (user.role === 'ADMIN') {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        window.location.href = "dashboard.html";
                    }
                }, 1000);

            } else {
                const errorText = await response.text();

                let displayError = "Invalid credentials.";
                if (errorText.includes("Login Failed")) {
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

const registerForm = document.getElementById('registerForm');
const sellerToggle = document.getElementById('sellerToggle');
const canteenField = document.getElementById('canteenField');

if (sellerToggle) {
    sellerToggle.addEventListener('change', function() {
        if (this.checked) {
            canteenField.classList.remove('d-none');
            document.getElementById('canteenName').setAttribute('required', 'true');
        } else {
            canteenField.classList.add('d-none');
            document.getElementById('canteenName').removeAttribute('required');
        }
    });
}

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

        let payload = {
            username: username,
            password: password,
            phoneNumber: phone,
            campus: campus
        };

        if (isSeller) {
            endpoint = "/api/auth/register/seller";


            payload = {
                ...payload,
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