// CONFIGURATION:
// If testing alone: use "http://localhost:8080"
// If testing with a friend: use "http://YOUR_FRIEND_IP:8080"
const API_BASE_URL = "http://localhost:8080";

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    // 1. Prevent the form from refreshing the page
    event.preventDefault();

    // 2. Get data from input boxes
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const messageArea = document.getElementById('messageArea');

    // Clear previous messages
    messageArea.textContent = "Connecting...";
    messageArea.className = "mt-3 text-center text-muted";

    // 3. Prepare the JSON payload (Matches AuthRequest in Java)
    const payload = {
        username: usernameInput,
        password: passwordInput
    };

    try {
        // 4. Send the POST Request to Spring Boot
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // 5. Handle the Response
        if (response.ok) {
            const user = await response.json();

            // SUCCESS: Show Green Message
            messageArea.textContent = `Welcome back, ${user.username}! (Role: ${user.role})`;
            messageArea.className = "mt-3 text-center text-success";

            console.log("Login Success:", user);

            // OPTIONAL: Redirect to dashboard after 1 second
            setTimeout(() => window.location.href = "dashboard.html", 1000);
            document.getElementById('loginForm').reset();

        } else {
            // ERROR: Show Red Message (e.g., "Invalid password")
            const errorMessage = await response.text(); // Backend returns text error
            // Clean up the error message if it's a JSON object or messy stack trace
            const cleanError = errorMessage.includes("Login Failed")
                ? errorMessage
                : "Invalid credentials or server error.";

            messageArea.textContent = cleanError;
            messageArea.className = "mt-3 text-center text-danger";
        }

    } catch (error) {
        // NETWORK ERROR (Server is offline or Firewall blocked)
        console.error("Connection Error:", error);
        messageArea.textContent = "Cannot connect to server. Is IntelliJ running?";
        messageArea.className = "mt-3 text-center text-danger";
    }
});