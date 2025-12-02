document.addEventListener("DOMContentLoaded", function() {

    // 1. Check if user is logged in
    const userJson = sessionStorage.getItem("loggedInUser");
    if (!userJson) {
        // Not logged in? Redirect to login page
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userJson);
    console.log("Logged in as:", user.username);

    // 2. Mock Data: In the future, this will be fetch('/api/sellers')
    // We render this dynamically to simulate a real app
    const canteens = [
        {
            name: "Emerson Canteen",
            location: "3rd Floor Devesse Building",
            campus: "SLU Mary Heights Campus",
            id: 1
        },
        {
            name: "Oval Canteen",
            location: "SLU Oval",
            campus: "SLU Mary Heights Campus",
            id: 2
        },
        {
            name: "Bakakeng Canteen",
            location: "Main Building",
            campus: "SLU Bakakeng Campus",
            id: 3
        }
    ];

    const container = document.getElementById('canteenContainer');

    // Clear static HTML placeholder if you want to use dynamic JS only
    // container.innerHTML = '';

    // 3. Render Logic (Optional: If you want to load from array instead of HTML)
    /*
    canteens.forEach(canteen => {
        const card = `
        <div class="card canteen-card shadow-sm mb-3" onclick="selectCanteen(${canteen.id})">
            <div class="placeholder-img d-flex align-items-center justify-content-center">
                <h4 class="text-white fw-bold">PLACEHOLDER</h4>
            </div>
            <div class="card-body">
                <h5 class="card-title fw-bold">${canteen.name}</h5>
                <p class="card-text text-muted small mb-0">${canteen.location}</p>
                <p class="card-text text-muted small">${canteen.campus}</p>
            </div>
        </div>`;
        container.innerHTML += card;
    });
    */
});

// 4. Function to handle clicking a canteen
function selectCanteen(id) {
    console.log("Selected Canteen ID:", id);
    // Save the ID so the Menu page knows which canteen to load
    sessionStorage.setItem("selectedCanteenId", id);
    window.location.href = "menu.html";
}