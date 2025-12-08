const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if(!user) {
        window.location.href = "../user/index.html";
        return;
    }

    // Display 'Seller' label
    const sellerNameEl = document.getElementById("sellerName");
    if (sellerNameEl) sellerNameEl.textContent = 'Seller';

    await loadStats();
    await loadSales();
});

async function loadStats() {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if(!user || !user.sellerProfile) return;
    const sellerId = user.sellerProfile.id;

    try {
        const [ordersResp, menuResp] = await Promise.all([
            fetch(`${API_BASE_URL}/api/orders/seller/${sellerId}`),
            fetch(`${API_BASE_URL}/api/menu/seller/${sellerId}`)
        ]);

        if (ordersResp.ok) {
            const orders = await ordersResp.json();
            // Count active orders (Pending/Progress/Ready) for the "Orders" card
            // You can change this to orders.length if you want to count EVERYTHING
            const activeCount = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
            document.getElementById("ordersCount").innerText = activeCount;
        }

        if (menuResp.ok) {
            const menu = await menuResp.json();
            document.getElementById("menuCount").innerText = menu.length;
        }
    } catch (e) { console.error(e); }
}

async function loadSales() {
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if(!user || !user.sellerProfile) return;
    const sellerId = user.sellerProfile.id;

    const salesContainer = document.getElementById("salesOverview");
    salesContainer.innerHTML = "<p class='text-muted small'>Loading sales...</p>";

    try {
        const resp = await fetch(`${API_BASE_URL}/api/orders/seller/${sellerId}`);
        if(!resp.ok) { salesContainer.innerHTML = "<p class='text-danger small'>Failed to load sales.</p>"; return; }

        let orders = await resp.json();

        // --- FIX IS HERE: Filter ONLY 'COMPLETED' orders for revenue ---
        const completedOrders = orders.filter(o => o.status === 'COMPLETED');

        // Compute total sales
        const totalSales = completedOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);

        // Compute today's sales
        const today = new Date();
        today.setHours(0,0,0,0);
        const todaysTotal = completedOrders.reduce((s, o) => {
            const d = new Date(o.createdAt);
            if (d >= today) return s + (o.totalPrice || 0);
            return s;
        }, 0);

        // Build the view
        salesContainer.innerHTML = `
            <div class="row mb-3">
                <div class="col-6">
                    <div class="stat-card" style="background: linear-gradient(135deg,#108756,#0d6e46);">
                        <div class="stat-number">${formatCurrency(totalSales)}</div>
                        <div class="stat-label">Total Sales</div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="stat-card" style="background: linear-gradient(135deg,#6c757d,#343a40);">
                        <div class="stat-number">${formatCurrency(todaysTotal)}</div>
                        <div class="stat-label">Today's Sales</div>
                    </div>
                </div>
            </div>
            <div>
                <h6 class="fw-bold mb-3">Recent Orders</h6>
                <div id="recentOrders"></div>
            </div>
        `;

        // Show recent orders (Show ALL types here so seller sees activity)
        const recent = orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
        const recentEl = document.getElementById('recentOrders');
        if(recent.length === 0) {
            recentEl.innerHTML = "<p class='text-muted small'>No orders yet.</p>";
            return;
        }

        recentEl.innerHTML = '';
        recent.forEach(o => {
            let iconClass = 'bi-hourglass-split';
            let bgClass = 'bg-primary';

            if (o.status === 'COMPLETED') {
                iconClass = 'bi-check-circle-fill';
                bgClass = 'bg-success';
            } else if (o.status === 'CANCELLED') {
                iconClass = 'bi-x-circle-fill';
                bgClass = 'bg-danger';
            } else if (o.status === 'READY_FOR_PICKUP') {
                iconClass = 'bi-bell-fill';
                bgClass = 'bg-warning text-dark';
            }

            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon-box ${bgClass} bg-opacity-10">
                    <i class="bi ${iconClass} fs-5"></i>
                </div>
                <div>
                   <div class='activity-text fw-semibold'>Order #${o.id} — ${o.status}</div>
                   <div class='activity-time mt-1'>${formatDate(o.createdAt)} — ${formatCurrency(o.totalPrice)}</div>
                </div>
            `;
            recentEl.appendChild(item);
        });

    } catch (e) {
        console.error(e);
        salesContainer.innerHTML = "<p class='text-danger small'>Failed to load sales.</p>";
    }
}

function formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '₱0.00';
    return '₱' + Number(amount).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}

function formatDate(dateString) {
    if(!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleString();
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}