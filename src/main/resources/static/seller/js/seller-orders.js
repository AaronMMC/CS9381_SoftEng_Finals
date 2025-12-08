document.addEventListener('DOMContentLoaded', () => {
  const btnActive = document.getElementById('btnActive');
  const btnHistory = document.getElementById('btnHistory');
  const ordersList = document.getElementById('ordersList');

  // 1. Check Session
  const userRaw = sessionStorage.getItem('loggedInUser');
  if (!userRaw) { window.location.href = '../user/index.html'; return; }

  let user;
  try { user = JSON.parse(userRaw); } catch { window.location.href = '../user/index.html'; return; }

  const sellerProfile = user.sellerProfile || user.seller || null;
  if (!sellerProfile || !sellerProfile.id) {
      alert('Seller profile missing');
      window.location.href = '../user/index.html';
      return;
  }
  const sellerId = sellerProfile.id;

  // 2. Setup Tab Click Listeners (SWITCHING MODES)
  if(btnActive) {
      btnActive.addEventListener('click', () => {
          updateTabs('active');
          loadOrders('active');
      });
  }

  if(btnHistory) {
      btnHistory.addEventListener('click', () => {
          updateTabs('history');
          loadOrders('history');
      });
  }

  // Helper to change button styles
  function updateTabs(mode) {
      if(mode === 'active') {
          btnActive.className = "btn btn-success text-white fw-bold px-4";
          btnHistory.className = "btn btn-outline-success fw-bold px-4";
      } else {
          btnActive.className = "btn btn-outline-success fw-bold px-4";
          btnHistory.className = "btn btn-success text-white fw-bold px-4";
      }
  }

  // 3. Load Orders Function
  function loadOrders(mode) {
    ordersList.innerHTML = '<p class="text-muted text-center mt-4">Loading...</p>';

    fetch(`/api/orders/seller/${sellerId}`)
      .then(res => res.json())
      .then(orders => {
        let list = orders || [];

        // --- FILTERING LOGIC ---
        if (mode === 'active') {
          list = list.filter(o => o.status === 'PENDING' || o.status === 'IN_PROGRESS' || o.status === 'READY_FOR_PICKUP');
        } else {
          // History Mode: Show Completed and Cancelled
          list = list.filter(o => o.status === 'COMPLETED' || o.status === 'CANCELLED');
        }

        if (!list.length) {
            ordersList.innerHTML = `<p class="text-muted text-center mt-4">No ${mode} orders found.</p>`;
            return;
        }

        // Sort: Newest first
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        ordersList.innerHTML = list.map(o => {
          const customerName = (o.customer && o.customer.username) ? o.customer.username : "Unknown Customer";
          const location = o.deliveryLocation || "No location provided";

          const itemsHtml = (o.orderItems || []).map(item =>
              `<div class="d-flex justify-content-between small">
                  <span>${item.quantity}x ${item.foodItem.name}</span>
                  <span>₱${(item.foodItem.price * item.quantity).toFixed(2)}</span>
               </div>`
          ).join('');

          // Buttons logic (Only for active tabs)
          let buttons = '';
          if (mode === 'active') {
              if (o.status === 'PENDING') {
                  buttons = `
                      <button class="btn btn-sm btn-success flex-grow-1" data-id="${o.id}" data-action="accept"><i class="bi bi-check-lg"></i> Accept</button>
                      <button class="btn btn-sm btn-danger flex-grow-1" data-id="${o.id}" data-action="deny"><i class="bi bi-x-lg"></i> Deny</button>
                  `;
              } else if (o.status === 'IN_PROGRESS') {
                  buttons = `<button class="btn btn-sm btn-primary w-100" data-id="${o.id}" data-action="ready"><i class="bi bi-bell"></i> Mark Ready</button>`;
              } else if (o.status === 'READY_FOR_PICKUP') {
                  buttons = `<button class="btn btn-sm btn-secondary w-100" data-id="${o.id}" data-action="complete"><i class="bi bi-bag-check"></i> Complete</button>`;
              }
          } else {
              // History Mode: No buttons, just status badge
              let badgeClass = o.status === 'COMPLETED' ? 'bg-success' : 'bg-danger';
              buttons = `<div class="w-100 text-center"><span class="badge ${badgeClass}">${o.status}</span></div>`;
          }

          return `
            <div class="card mb-3 shadow-sm border-0" style="border-radius: 15px;">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="fw-bold mb-0 text-success">Order #${o.id}</h6>
                  <small class="text-muted">${new Date(o.createdAt).toLocaleDateString()} ${new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                </div>

                <div class="mb-3 p-2 bg-light rounded">
                    <div class="small fw-bold text-dark"><i class="bi bi-person-fill"></i> ${customerName}</div>
                    <div class="small text-muted"><i class="bi bi-geo-alt-fill"></i> ${location}</div>
                </div>

                <div class="mb-3 border-top border-bottom py-2">
                    ${itemsHtml}
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-bold">Total</span>
                    <span class="fw-bold text-success fs-5">₱${(o.totalPrice||0).toFixed(2)}</span>
                </div>

                <div class="d-flex gap-2">
                    ${buttons}
                </div>
              </div>
            </div>
          `;
        }).join('');
      })
      .catch(err => {
          console.error(err);
          ordersList.innerHTML = '<p class="text-danger text-center">Failed to load orders.</p>';
      });
  }

  // 4. Handle Actions
  ordersList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    let newStatus;

    if (action === 'accept') newStatus = 'IN_PROGRESS';
    if (action === 'deny') {
        if(!confirm("Reject this order?")) return;
        newStatus = 'CANCELLED';
    }
    if (action === 'ready') newStatus = 'READY_FOR_PICKUP';
    if (action === 'complete') newStatus = 'COMPLETED';

    if (!newStatus) return;

    fetch(`/api/orders/${id}/status?newStatus=${newStatus}`, { method: 'POST' })
      .then(res => {
          if(!res.ok) throw new Error("Action failed");
          // Refresh the Active tab to show it moved
          loadOrders('active');
      })
      .catch(err => alert('Failed to update order status'));
  });

  // Initial Load
  loadOrders('active');
});