const CART_KEY = "papCart";
const API_BASE_URL = "http://localhost:8080";
const canteenId = sessionStorage.getItem("selectedCanteenId");

document.addEventListener("DOMContentLoaded", () => {
  if (!canteenId) {
    alert("No canteen selected.");
    window.location.href = "dashboard.html";
    return;
  }
  loadMenu(canteenId);
  updateCartBadge();
});

async function loadMenu(id) {
    const menuList = document.getElementById("menuList");
    // Show a loading text while fetching
    menuList.innerHTML = "<p class='text-center text-muted mt-5'>Loading menu...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/api/menu/seller/${id}`);
        if(!response.ok) throw new Error("Failed");

        const items = await response.json();
        renderMenu(items);
    } catch (e) {
        menuList.innerHTML = "<p class='text-danger text-center mt-5'>Could not load menu. Is the server running?</p>";
    }
}

function renderMenu(items) {
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = "";

    if (!items || items.length === 0) {
        menuList.innerHTML = "<div class='text-center text-muted mt-5'><h5>Menu is empty</h5><p>This canteen hasn't added any food yet.</p></div>";
        return;
    }

    items.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-6 menu-card-wrapper";

        const availabilityLabel = item.available
            ? `<span class="text-success small fw-bold">Available</span>`
            : `<span class="text-danger small fw-bold">Sold Out</span>`;

        const imgUrl = item.imageUrl || 'img/placeholder.png';

        // Prepare data for cart
        const itemData = encodeURIComponent(JSON.stringify(item));

        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div style="height: 120px; overflow: hidden; border-radius: 16px 16px 0 0;">
                    <img src="${imgUrl}" class="menu-food-img" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="card-body d-flex flex-column p-2">
                    <div class="food-name text-truncate fw-bold mb-1">${item.name}</div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        ${availabilityLabel}
                        <div class="food-price fw-bold text-dark">₱ ${item.price}</div>
                    </div>
                    <button
                        class="btn btn-success-custom add-to-cart-btn mt-auto w-100 btn-sm"
                        onclick="addToCart('${itemData}')"
                        ${item.available ? "" : "disabled"}
                    >
                        ${item.available ? '<i class="bi bi-plus-lg"></i> Add' : 'Sold Out'}
                    </button>
                </div>
            </div>
        `;
        menuList.appendChild(col);
    });
}

function addToCart(itemJson) {
    const item = JSON.parse(decodeURIComponent(itemJson));
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

    // Check if cart has items from a different seller
    if (cart.length > 0 && cart[0].sellerId !== item.sellerId) {
        if(!confirm("Start a new basket? You can only order from one canteen at a time.")) return;
        cart.length = 0; // Clear cart
    }

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            img: item.imageUrl,
            sellerId: item.sellerId,
            quantity: 1
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
     alert("Added!");
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge-count");
  if (!badge) return;
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}