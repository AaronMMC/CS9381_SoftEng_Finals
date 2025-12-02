const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if(user) document.getElementById("adminName").textContent = user.username;

    loadStats();

    loadActivities();
});

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
        if(response.ok) {
            const stats = await response.json();
            document.getElementById("pendingCount").innerText = stats.pendingCount;
            document.getElementById("activeCount").innerText = stats.activeSellersCount;
        }
    } catch (e) { console.error(e); }
}

async function loadActivities() {
    const activityContainer = document.getElementById("activityFeed");
    activityContainer.innerHTML = "<p class='text-muted small'>Loading history...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/activities`);
        const activities = await response.json();

        activityContainer.innerHTML = "";

        if (activities.length === 0) {
            activityContainer.innerHTML = "<p class='text-muted small'>No recent activities.</p>";
            return;
        }

        activities.forEach(log => {
            let iconClass = "bi-info-circle-fill text-primary";
            let bgClass = "bg-primary";

            if (log.type === "SUCCESS") {
                iconClass = "bi-check-circle-fill text-success";
                bgClass = "bg-success";
            } else if (log.type === "DANGER") {
                iconClass = "bi-x-circle-fill text-danger";
                bgClass = "bg-danger";
            }

            const item = document.createElement("div");
            item.className = "activity-item";
            item.innerHTML = `
                <div class="activity-icon-box ${bgClass} bg-opacity-10">
                    <i class="bi ${iconClass} fs-5"></i>
                </div>
                <div>
                    <div class="activity-text fw-semibold">${log.message}</div>
                    <div class="activity-time mt-1">${formatDate(log.timestamp)}</div>
                </div>
            `;
            activityContainer.appendChild(item);
        });

    } catch (e) {
        console.error(e);
        activityContainer.innerHTML = "<p class='text-danger small'>Failed to load activities.</p>";
    }
}

function formatDate(dateString) {
    if(!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}