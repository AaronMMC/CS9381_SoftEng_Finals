const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", function () {
  const userJson = sessionStorage.getItem("loggedInUser");
  if (!userJson) {
    window.location.href = "index.html";
    return;
  }
  
  loadCanteens(); // Load real data
  updateCartBadge();
});

async function loadCanteens() {
    const container = document.getElementById("canteenContainer");
    try {
        // Fetch from the new endpoint
        const response = await fetch(`${API_BASE_URL}/api/users/sellers`);
        if(!response.ok) throw new Error("Failed to load");

        const sellers = await response.json();
        container.innerHTML = "";

        if(sellers.length === 0) {
            container.innerHTML = "<p class='text-center text-muted'>No active canteens found.</p>";
            return;
        }

        sellers.forEach(seller => {
            const card = document.createElement("div");
            card.className = "card canteen-card shadow-sm mb-3";
            card.onclick = function() { selectCanteen(seller.id); };

            const initial = seller.canteenName.charAt(0).toUpperCase();
            
            card.innerHTML = `
                <div class="placeholder-img d-flex align-items-center justify-content-center" style="background-color: #108756;">
                    <h1 class="text-white fw-bold display-4">${initial}</h1>
                </div>
                <div class="card-body">
                    <h5 class="card-title fw-bold">${seller.canteenName}</h5>
                    <p class="card-text text-muted small mb-0">Tap to view menu</p>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (e) {
        console.error(e);
        container.innerHTML = "<p class='text-danger text-center'>Server Error.</p>";
    }
}

function selectCanteen(id) {
  sessionStorage.setItem("selectedCanteenId", id);
  window.location.href = "menu.html";
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge-count");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem("papCart") || "[]");
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}