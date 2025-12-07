document.addEventListener('DOMContentLoaded', async function () {
    const form = document.getElementById('editForm');
    const imgInput = document.getElementById('imgFile');
    const deleteBtn = document.getElementById('deleteBtn');
    const foodId = sessionStorage.getItem('editingFoodId');

    if (!foodId) {
        alert("No item selected.");
        window.location.href = 'seller-menu.html';
        return;
    }

    // 1. Attach Listeners
    if (imgInput) {
        imgInput.addEventListener('change', previewImage);
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteItem);
    }

    // 2. Fetch Item Details
    try {
        const response = await fetch(`/api/menu/${foodId}`);
        if (!response.ok) throw new Error("Item not found");

        const item = await response.json();

        // Fill Form
        document.getElementById('name').value = item.name;
        document.getElementById('price').value = item.price;
        if (document.getElementById('description')) {
            document.getElementById('description').value = item.description || "";
        }

        // Handle Availability dropdown
        const availSelect = document.getElementById('available');
        if (availSelect) availSelect.value = item.available ? 'true' : 'false';

        // Show existing image
        if (item.imageUrl) {
            document.getElementById('imagePreview').innerHTML = `<img src="${item.imageUrl}" style="width:100%; height:100%; object-fit:cover;">`;
        }

    } catch (e) {
        console.error(e);
        alert("Could not load item details.");
        window.location.href = 'seller-menu.html';
    }

    // 3. Handle Update
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const description = document.getElementById('description') ? document.getElementById('description').value : "";
        const imgFile = imgInput.files[0];

        let imageUrl = null;

        if (imgFile) {
            if (imgFile.size > 1048576) {
                alert("Image is too large! Please choose an image under 1MB.");
                return;
            }
            try {
                imageUrl = await toBase64(imgFile);
            } catch (err) {
                console.error(err);
                alert("Error processing image.");
                return;
            }
        }

        const payload = {
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl
        };

        try {
            const response = await fetch(`/api/menu/${foodId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Item updated!');
                window.location.href = 'seller-menu.html';
            } else {
                alert('Update failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error.');
        }
    });
});

function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function deleteItem() {
    if (confirm('Are you sure you want to delete this item?')) {
        const foodId = sessionStorage.getItem('editingFoodId');
        if (foodId) {
            fetch(`/api/menu/${foodId}`, { method: 'DELETE' })
                .then(r => r.ok ? window.location.href = 'seller-menu.html' : alert('Delete failed'))
                .catch(() => alert('Error deleting item'));
        }
    }
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});