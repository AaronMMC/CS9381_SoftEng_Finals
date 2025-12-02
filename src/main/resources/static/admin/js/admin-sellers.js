const API_BASE_URL = "http://localhost:8080";
let currentSellers = [];

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view');

    if (view === 'approved') {
        switchTab('approved');
    } else {
        switchTab('pending');
    }

    document.getElementById("searchInput").addEventListener("input", function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterAndRender(searchTerm);
    });
});

async function switchTab(tabName) {
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active', 'bg-success', 'text-white', 'fw-bold', 'shadow-sm');
        btn.classList.add('text-muted');
    });

    const activeBtn = document.getElementById(`tab-${tabName}`);
    if(activeBtn) {
        activeBtn.classList.add('active', 'bg-success', 'text-white', 'fw-bold', 'shadow-sm');
        activeBtn.classList.remove('text-muted');
    }

    const listArea = document.getElementById("pendingListArea");
    listArea.innerHTML = "<p class='text-center text-muted mt-5'>Loading...</p>";

    let endpoint = "/api/admin/pending-sellers";

    if (tabName === 'approved') {
        endpoint = "/api/admin/approved-sellers";
    } else if (tabName === 'all') {
        endpoint = "/api/admin/all-sellers";
    }

    try {
        const response = await fetch(API_BASE_URL + endpoint);
        if (!response.ok) throw new Error("Failed to fetch");

        currentSellers = await response.json();
        filterAndRender("");
    } catch (e) {
        console.error(e);
        listArea.innerHTML = "<p class='text-danger text-center'>Error loading data.</p>";
    }
}

function filterAndRender(searchTerm) {
    const listArea = document.getElementById("pendingListArea");
    listArea.innerHTML = "";

    const filtered = currentSellers.filter(seller =>
        seller.canteenName.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        listArea.innerHTML = "<p class='text-center text-muted mt-4'>No results found.</p>";
        return;
    }

    filtered.forEach(seller => {
        let actionButtons = '';
        let statusBadge = '';

        const rawStatus = (seller.approved !== undefined) ? seller.approved : seller.isApproved;
        const isApproved = (String(rawStatus) === "true" || rawStatus === true);

        if (isApproved) {
            statusBadge = `<small class="text-success fw-bold"><i class="bi bi-check-circle-fill"></i> Active</small>`;

            actionButtons = `
                <div class="d-flex gap-2 mt-2">
                    <button class="btn btn-sm btn-outline-danger px-3 fw-bold">Suspend</button>
                    <button class="btn btn-sm btn-outline-secondary px-3 fw-bold">View</button>
                </div>
            `;
        } else {
            statusBadge = `<small class="text-warning fw-bold"><i class="bi bi-hourglass-split"></i> Pending</small>`;

            actionButtons = `
                <div class="d-flex gap-2 mt-2">
                    <button onclick="approve(${seller.id})" class="btn btn-sm btn-success px-3 fw-bold">Approve</button>
                    <button onclick="reject(${seller.id})" class="btn btn-sm btn-danger px-3 fw-bold">Reject</button>
                </div>
            `;
        }

        const card = document.createElement("div");
        card.className = "seller-card";
        card.innerHTML = `
            <div class="placeholder-img-sm">IMG</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="fw-bold mb-0 text-dark">${seller.canteenName}</h6>
                        <small class="text-muted d-block" style="font-size: 0.8rem;">
                            User: ${seller.user ? seller.user.username : 'Unknown'}
                        </small>
                    </div>
                    ${statusBadge}
                </div>
                ${actionButtons}
            </div>
        `;
        listArea.appendChild(card);
    });
}
async function approve(id) {
    if(!confirm("Approve this seller?")) return;
    await fetch(`${API_BASE_URL}/api/admin/approve/${id}`, { method: 'POST' });

    const activeTab = document.querySelector('.nav-link.active').id.replace('tab-', '');
    switchTab(activeTab);
}

async function reject(id) {
    if(!confirm("Reject application?")) return;
    await fetch(`${API_BASE_URL}/api/admin/reject/${id}`, { method: 'DELETE' });

    const activeTab = document.querySelector('.nav-link.active').id.replace('tab-', '');
    switchTab(activeTab);
}

function logout() {
    sessionStorage.clear();
    window.location.href = "../user/index.html";
}