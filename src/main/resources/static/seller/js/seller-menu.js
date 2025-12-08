const API_BASE_URL = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', function () {
    const menuList = document.getElementById('menuList');
    const userJson = sessionStorage.getItem('loggedInUser');

    // 1. Check Session
    if (!userJson) {
        window.location.href = '../user/index.html';
        return;
    }

    let user;
    try {
        user = JSON.parse(userJson);
    } catch (e) {
        console.error('Invalid user session', e);
        window.location.href = '../user/index.html';
        return;
    }

    const sellerProfile = user.sellerProfile || user.seller || null;
    if (!sellerProfile || !sellerProfile.id) {
        alert('You are not a seller or your seller profile is missing.');
        window.location.href = '../user/index.html';
        return;
    }

    const sellerId = sellerProfile.id;

    // 2. Load Menu (FIXED: Added API_BASE_URL)
    fetch(`${API_BASE_URL}/api/menu/seller/${sellerId}`)
        .then((res) => {
            if (!res.ok) throw new Error('Failed to load menu');
            return res.json();
        })
        .then((menu) => renderMenu(menu || []))
        .catch((err) => {
            console.error(err);
            menuList.innerHTML = '<div class="col-12 text-danger">Failed to load menu. Is the server running?</div>';
        });

    function renderMenu(items) {
        if (!items || items.length === 0) {
            menuList.innerHTML = '<div class="col-12 text-muted">No menu items yet. Use "Add Item" to create one.</div>';
            return;
        }

        menuList.innerHTML = items
            .map((it) => {
                const availableBadge = it.available
                    ? '<span class="badge bg-success ms-2">Available</span>'
                    : '<span class="badge bg-secondary ms-2">Unavailable</span>';

                // Use placeholder if image is missing
                const imgUrl = it.imageUrl || '../user/img/Pinakbet.jpg';

                return `
                    <div class="col-12 col-md-6 col-lg-4 mb-3">
                        <div class="card h-100 shadow-sm">
                            <div style="height: 150px; overflow: hidden; background-color: #eee;">
                                <img src="${imgUrl}" class="card-img-top" style="width: 100%; height: 100%; object-fit: cover;" alt="${escapeHtml(it.name)}">
                            </div>

                            <div class="card-body d-flex flex-column">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title mb-0 fw-bold">${escapeHtml(it.name || '')}</h5>
                                    <span class="fw-bold text-success">₱${(it.price||0).toFixed(2)}</span>
                                </div>

                                <div class="mb-2">${availableBadge}</div>
                                <p class="card-text text-muted small flex-grow-1">${escapeHtml(it.description || 'No description')}</p>

                                <div class="mt-3 d-flex justify-content-between align-items-center gap-2">
                                    <button class="btn btn-outline-primary btn-sm flex-fill" onclick="onEdit(${it.id})">
                                        <i class="bi bi-pencil"></i> Update
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm flex-fill" onclick="onDelete(${it.id})">
                                        <i class="bi bi-trash"></i> Delete
                                    </button>
                                </div>
                                <div class="mt-2">
                                     <button class="btn btn-sm w-100 ${it.available ? 'btn-warning' : 'btn-success'}" onclick="onToggle(${it.id})">
                                        ${it.available ? 'Mark Sold Out' : 'Mark Available'}
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    // Expose handlers globally so onclick works
    window.onEdit = function (foodId) {
        sessionStorage.setItem('editingFoodId', foodId);
        window.location.href = 'edit-menu.html';
    };

    window.onDelete = function (foodId) {
        if (!confirm('Delete this item?')) return;

        // FIXED: Added API_BASE_URL
        fetch(`${API_BASE_URL}/api/menu/${foodId}`, { method: 'DELETE' })
            .then((res) => {
                if (!res.ok) throw new Error('Delete failed');
                // Refresh list using correct URL
                return fetch(`${API_BASE_URL}/api/menu/seller/${sellerId}`);
            })
            .then((res) => res.json())
            .then((menu) => renderMenu(menu || []))
            .catch((err) => alert('Failed to delete item'));
    };

    window.onToggle = function (foodId) {
        // FIXED: Added API_BASE_URL
        fetch(`${API_BASE_URL}/api/menu/${foodId}/toggle-availability`, { method: 'POST' })
            .then((res) => {
                if (!res.ok) throw new Error('Toggle failed');
                // Refresh list using correct URL
                return fetch(`${API_BASE_URL}/api/menu/seller/${sellerId}`);
            })
            .then((res) => res.json())
            .then((menu) => renderMenu(menu || []))
            .catch((err) => alert('Failed to update availability'));
    };

    function escapeHtml(text) {
        if (!text) return '';
        return text.replace(/[&<>"']/g, function (c) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]);
        });
    }
});

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}