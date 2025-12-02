const API_BASE_URL = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!user || !user.sellerProfile) {
        window.location.href = '../user/index.html';
        return;
    }
    const sellerNameEl = document.getElementById('sellerName');
    if (sellerNameEl) sellerNameEl.textContent = 'Seller';
    loadMenu();

    const form = document.getElementById('addItemForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await addItem();
    });
});

async function loadMenu() {
    const container = document.getElementById('menuItemsContainer');
    container.innerHTML = '<p class="text-muted small">Loading menu...</p>';
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    try {
        const resp = await fetch(`${API_BASE_URL}/api/menu/seller/${user.sellerProfile.id}`);
        if (!resp.ok) throw new Error('Failed to load menu');
        const menu = await resp.json();
        if (menu.length === 0) { container.innerHTML = '<p class="text-muted small">No menu items yet.</p>'; return; }

        container.innerHTML = '';
        menu.forEach(item => {
            const card = document.createElement('div');
            card.className = 'seller-card';
            card.innerHTML = `
                <div class='placeholder-img-sm'>${item.name.substring(0,2).toUpperCase()}</div>
                <div style='flex:1;'>
                    <h6 class='fw-bold mb-0 text-dark'>${item.name} <small class='text-muted'>₱${Number(item.price).toFixed(2)}</small></h6>
                    <small class='text-muted'>${item.description || ''}</small>
                </div>
                <div class='text-end'>
                    <button class='btn btn-sm btn-outline-primary mb-1' onclick='toggleAvailability(${item.id})'>${item.available ? 'Available' : 'Sold Out'}</button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (e) { console.error(e); container.innerHTML = '<p class="text-danger small">Could not load menu.</p>'; }
}

async function toggleAvailability(foodId) {
    try {
        const resp = await fetch(`${API_BASE_URL}/api/menu/${foodId}/toggle-availability`, { method: 'POST' });
        if (!resp.ok) throw new Error('Failed to toggle');
        await loadMenu();
    } catch (e) { console.error(e); alert('Failed to toggle item availability'); }
}

async function addItem() {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const desc = document.getElementById('itemDesc').value;
    const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
    try {
        const payload = { sellerId: user.sellerProfile.id, name: name, price: price, description: desc };
        const resp = await fetch(`${API_BASE_URL}/api/menu/add`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!resp.ok) throw new Error('Failed to add item');
        // reset form
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemDesc').value = '';
        await loadMenu();
    } catch (e) { console.error(e); alert('Failed to add item'); }
}
