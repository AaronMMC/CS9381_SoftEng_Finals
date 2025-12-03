document.addEventListener("DOMContentLoaded", function () {
  const userJson = sessionStorage.getItem("loggedInUser");
  if (!userJson) {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(userJson);
  console.log("Logged in as:", user.username);

  const canteens = [
    {
      name: "Emerson Canteen",
      location: "3rd Floor Devesse Building",
      campus: "SLU Mary Heights Campus",
      id: 1,
    },
    {
      name: "Oval Canteen",
      location: "SLU Oval",
      campus: "SLU Mary Heights Campus",
      id: 2,
    },
    {
      name: "Bakakeng Canteen",
      location: "Main Building",
      campus: "SLU Bakakeng Campus",
      id: 3,
    },
  ];

  const container = document.getElementById("canteenContainer");
});

function selectCanteen(id) {
  console.log("Selected Canteen ID:", id);
  sessionStorage.setItem("selectedCanteenId", id);
  window.location.href = "menu.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("dashboardSearchInput");

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const term = searchInput.value.trim();

        const url = term
          ? `menu.html?search=${encodeURIComponent(term)}`
          : "menu.html";
        window.location.href = url;
      }
    });
  }
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
