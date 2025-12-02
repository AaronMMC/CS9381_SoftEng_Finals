const API_BASE_URL = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!user || !user.sellerProfile) {
        window.location.href = '../user/index.html';
        return;
    }
    const sellerNameEl = document.getElementById('sellerName');
    if (sellerNameEl) sellerNameEl.textContent = 'Seller';
    await loadActiveOrders();
    await loadPastOrders();
});

async function loadActiveOrders() {
    const container = document.getElementById('activeOrdersContainer');
    container.innerHTML = '<p class="text-muted small">Loading active orders...</p>';
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    try {
        const resp = await fetch(`${API_BASE_URL}/api/orders/seller/${user.sellerProfile.id}`);
        if (!resp.ok) throw new Error('Failed to fetch orders');
        const orders = await resp.json();
        const active = orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
        if (active.length === 0) {
            container.innerHTML = '<p class="text-muted small">No active orders.</p>';
            return;
        }

        container.innerHTML = '';
        active.forEach(o => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon-box bg-primary bg-opacity-10">
                    <i class="bi bi-hourglass-split fs-5"></i>
                </div>
                <div>
                  <div class='activity-text fw-semibold'>Order #${o.id} — ${o.status}</div>
                  <div class='activity-time mt-1'>${formatDate(o.createdAt)} — ${formatCurrency(o.totalPrice)}</div>
                  <div class='mt-2'>
                      ${o.status === 'PENDING' ? `<button class='btn btn-sm btn-success me-2' onclick='updateOrderStatus(${o.id}, "IN_PROGRESS")'>Accept</button>` : ''}
                      ${o.status === 'IN_PROGRESS' ? `<button class='btn btn-sm btn-primary me-2' onclick='updateOrderStatus(${o.id}, "READY_FOR_PICKUP")'>Mark as Ready</button>` : ''}
                  </div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-danger small">Could not load active orders.</p>';
    }
}

async function loadPastOrders() {
    const container = document.getElementById('orderHistoryContainer');
    container.innerHTML = '<p class="text-muted small">Loading order history...</p>';
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    try {
        const resp = await fetch(`${API_BASE_URL}/api/orders/seller/${user.sellerProfile.id}`);
        if (!resp.ok) throw new Error('Failed to fetch orders');
        const orders = await resp.json();
        const past = orders.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');
        if (past.length === 0) {
            container.innerHTML = '<p class="text-muted small">No order history.</p>';
            return;
        }

        container.innerHTML = '';
        past.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(o => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-icon-box ${o.status === 'COMPLETED' ? 'bg-success' : 'bg-danger'} bg-opacity-10">
                    <i class="bi ${o.status === 'COMPLETED' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} fs-5"></i>
                </div>
                <div>
                  <div class='activity-text fw-semibold'>Order #${o.id} — ${o.status}</div>
                  <div class='activity-time mt-1'>${formatDate(o.createdAt)} — ${formatCurrency(o.totalPrice)}</div>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p class="text-danger small">Could not load order history.</p>';
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status?newStatus=${status}`, { method: 'POST' });
        if (!resp.ok) throw new Error('Failed to update status');
        await loadActiveOrders();
        await loadPastOrders();
    } catch (e) {
        console.error(e);
        alert('Could not update order status.');
    }
}

function formatDate(dateString) {
    if(!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleString();
}

function formatCurrency(amount) {
    if (!amount || isNaN(amount)) return '₱0.00';
    return '₱' + Number(amount).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});

}
