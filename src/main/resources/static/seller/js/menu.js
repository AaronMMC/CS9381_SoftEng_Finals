const CART_KEY = "papCart";

// simple demo menu (keeps same structure as user menu)
const SAMPLE_MENU = [
  { id: 1, name: "Pinakbet", price: 80, available: true, img: "/user/img/Pinakbet.jpg" },
  { id: 2, name: "Sisig", price: 100, available: true, img: "/user/img/Sisig.webp" },
  { id: 3, name: "Rice", price: 20, available: true, img: "/user/img/Rice.webp" },
  { id: 4, name: "Sinigang", price: 100, available: false, img: "/user/img/Sinigang.jpg" },
  { id: 5, name: "Fried Chicken", price: 60, available: true, img: "/user/img/Chicken.jpg" },
  { id: 6, name: "Giniling", price: 80, available: true, img: "/user/img/Giniling.jpg" },
];

function getSearchTermFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("search") || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const menuList = document.getElementById("menuList");
  const searchInput = document.getElementById("searchInput");

  if (!menuList) return;

  let currentItems = [...SAMPLE_MENU];

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const badge = document.querySelector(".cart-badge-count");
    if (!badge) return;
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalQty || "";
    badge.style.display = totalQty ? "inline-block" : "none";
  }

  function renderMenu(items) {
    menuList.innerHTML = "";

    if (!items.length) {
      menuList.innerHTML = `<p class="text-center text-muted mt-4">No items found.</p>`;
      return;
    }

    items.forEach((item) => {
      const col = document.createElement("div");
      col.className = "col-6 menu-card-wrapper";

      const availabilityLabel = item.available
        ? `<span class="text-success">Available</span>`
        : `<span class="text-danger">Not available</span>`;

      col.innerHTML = `
        <div class="card h-100">
          <img src="${item.img}" class="menu-food-img" alt="${item.name}">
          <div class="card-body d-flex flex-column">
            <div class="food-name">${item.name}</div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <div class="food-availability small">${availabilityLabel}</div>
              <div class="food-price">₱ ${item.price}</div>
            </div>
            <button 
              class="btn btn-success-custom add-to-cart-btn mt-auto"
              data-id="${item.id}"
              ${item.available ? "" : "disabled"}
            >
              UPDATE
            </button>
          </div>
        </div>
      `;

      menuList.appendChild(col);
    });
  }

  // For seller, clicking the main button goes to edit page — store id in session
  function onUpdateClick(itemId) {
    sessionStorage.setItem('editingFoodId', itemId);
    window.location.href = 'edit-menu.html';
  }

  const urlSearchTerm = getSearchTermFromUrl().toLowerCase();

  if (urlSearchTerm) {
    currentItems = SAMPLE_MENU.filter((item) =>
      item.name.toLowerCase().includes(urlSearchTerm)
    );
    if (searchInput) {
      searchInput.value = urlSearchTerm;
    }
  }

  renderMenu(currentItems);
  updateCartBadge();

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase().trim();
      currentItems = SAMPLE_MENU.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      renderMenu(currentItems);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });
  }

  menuList.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const id = parseInt(btn.getAttribute("data-id"), 10);
    onUpdateClick(id);
  });
});

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge-count");
  if (!badge) return;

  const cart = JSON.parse(localStorage.getItem("papCart") || "[]");
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  badge.textContent = total;
  badge.style.display = total > 0 ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
