document.addEventListener('DOMContentLoaded', function () {
	const menuList = document.getElementById('menuList');

	const userJson = sessionStorage.getItem('loggedInUser');
	if (!userJson) {
		// Redirect to login if not logged in
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

	fetch(`/api/menu/seller/${sellerId}`)
		.then((res) => {
			if (!res.ok) throw new Error('Failed to load menu');
			return res.json();
		})
		.then((menu) => renderMenu(menu || []))
		.catch((err) => {
			console.error(err);
			menuList.innerHTML = '<div class="col-12">Failed to load menu.</div>';
		});

	function renderMenu(items) {
		if (!items || items.length === 0) {
			menuList.innerHTML = '<div class="col-12">No menu items yet. Use "Add Item" to create one.</div>';
			return;
		}

		menuList.innerHTML = items
			.map((it) => {
				const availableBadge = it.available ? '<span class="badge bg-success ms-2">Available</span>' : '<span class="badge bg-secondary ms-2">Unavailable</span>';
				return `
					<div class="col-12 col-md-6 col-lg-4 mb-3">
						<div class="card h-100">
							<div class="card-body d-flex flex-column">
								<div class="d-flex justify-content-between align-items-start mb-2">
									<h5 class="card-title mb-0">${escapeHtml(it.name || '')} ${availableBadge}</h5>
									<small class="text-muted">₱${(it.price||0).toFixed(2)}</small>
								</div>
								<p class="card-text text-muted">${escapeHtml(it.description || '')}</p>
								<div class="mt-auto d-flex justify-content-between align-items-center">
									<div>
										<button class="btn btn-outline-primary btn-sm" onclick="onEdit(${it.id})">Update</button>
										<button class="btn btn-outline-danger btn-sm ms-2" onclick="onDelete(${it.id})">Delete</button>
									</div>
									<div>
										<button class="btn btn-sm btn-${it.available ? 'warning' : 'secondary'}" onclick="onToggle(${it.id})">${it.available ? 'Hide' : 'Show'}</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				`;
			})
			.join('');
	}

	// Expose handlers to global scope for inline onclick
	window.onEdit = function (foodId) {
		sessionStorage.setItem('editingFoodId', foodId);
		window.location.href = 'edit-menu.html';
	};

	window.onDelete = function (foodId) {
		if (!confirm('Delete this item?')) return;
		fetch(`/api/menu/${foodId}`, { method: 'DELETE' })
			.then((res) => {
				if (!res.ok) throw new Error('Delete failed');
				// refresh
				return fetch(`/api/menu/seller/${sellerId}`);
			})
			.then((res) => res.json())
			.then((menu) => renderMenu(menu || []))
			.catch((err) => alert('Failed to delete item'));
	};

	window.onToggle = function (foodId) {
		fetch(`/api/menu/${foodId}/toggle-availability`, { method: 'POST' })
			.then((res) => {
				if (!res.ok) throw new Error('Toggle failed');
				return fetch(`/api/menu/seller/${sellerId}`);
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

