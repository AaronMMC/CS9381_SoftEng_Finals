document.addEventListener('DOMContentLoaded', () => {
  const btnActive = document.getElementById('btnActive');
  const btnHistory = document.getElementById('btnHistory');
  const ordersList = document.getElementById('ordersList');

  const userRaw = sessionStorage.getItem('loggedInUser');
  if (!userRaw) { window.location.href = '../user/index.html'; return; }
  let user;
  try { user = JSON.parse(userRaw); } catch { window.location.href = '../user/index.html'; return; }
  const sellerProfile = user.sellerProfile || user.seller || null;
  if (!sellerProfile || !sellerProfile.id) { alert('Seller profile missing'); window.location.href = '../user/index.html'; return; }
  const sellerId = sellerProfile.id;

  btnActive.addEventListener('click', () => loadOrders('active'));
  btnHistory.addEventListener('click', () => loadOrders('history'));

  function loadOrders(mode) {
    ordersList.innerHTML = '<p class="text-muted">Loading...</p>';
    fetch(`/api/orders/seller/${sellerId}`)
      .then(res => res.json())
      .then(orders => {
        let list = orders || [];
        if (mode === 'active') {
          list = list.filter(o => o.status === 'PENDING' || o.status === 'IN_PROGRESS' || o.status === 'READY_FOR_PICKUP');
        } else {
          list = list.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');
        }

        if (!list.length) { ordersList.innerHTML = '<p class="text-muted">No orders.</p>'; return; }

        ordersList.innerHTML = list.map(o => {
          const items = (o.items||[]).map(it => `<div>${it.foodName} x ${it.quantity}</div>`).join('');
          return `
            <div class="card mb-2">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <div><strong>Order #${o.id}</strong></div>
                    <div class="text-muted">Status: ${o.status}</div>
                    <div class="small">Customer: ${o.customerId}</div>
                  </div>
                  <div class="text-end">
                    <div>Total: ₱${(o.totalPrice||0).toFixed(2)}</div>
                    <div class="mt-2">
                      ${mode === 'active' ? `<button class="btn btn-sm btn-success" data-id="${o.id}" data-action="accept">Accept</button> <button class="btn btn-sm btn-warning" data-id="${o.id}" data-action="ready">Mark Ready</button> <button class="btn btn-sm btn-primary" data-id="${o.id}" data-action="complete">Complete</button>` : ''}
                    </div>
                  </div>
                </div>
                <hr />
                ${items}
              </div>
            </div>
          `;
        }).join('');
      })
      .catch(err => { console.error(err); ordersList.innerHTML = '<p class="text-danger">Failed to load orders.</p>'; });
  }

  // handle actions
  ordersList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    let newStatus;
    if (action === 'accept') newStatus = 'IN_PROGRESS';
    if (action === 'ready') newStatus = 'READY_FOR_PICKUP';
    if (action === 'complete') newStatus = 'COMPLETED';
    if (!newStatus) return;

    fetch(`/api/orders/${id}/status?newStatus=${newStatus}`, { method: 'POST' })
      .then(res => res.text())
      .then(() => loadOrders('active'))
      .catch(() => alert('Failed to update order status'));
  });

  // initial
  loadOrders('active');
});
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

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}