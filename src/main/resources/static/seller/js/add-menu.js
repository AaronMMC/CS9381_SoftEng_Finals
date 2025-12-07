document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addForm');
    const imgInput = document.getElementById('imgFile'); // Get file input

    // 1. Get User Session
    const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (!user || !user.sellerProfile) {
        alert("Please login as a seller.");
        window.location.href = '../user/index.html';
        return;
    }

    // 2. Attach Image Preview Listener
    if (imgInput) {
        imgInput.addEventListener('change', function(event) {
            previewImage(event);
        });
    }

    // 3. Handle Form Submit
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        // Ensure description input exists in your HTML, otherwise default to empty string
        const description = document.getElementById('description') ? document.getElementById('description').value : "";
        const imgFile = imgInput.files[0];

        if (!name || !price) {
            alert("Name and Price are required.");
            return;
        }

        // Convert Image to Base64 String
        let imageUrl = "";
        if (imgFile) {
            try {
                imageUrl = await toBase64(imgFile);
            } catch (err) {
                console.error(err);
                alert("Error processing image.");
                return;
            }
        }

        const payload = {
            sellerId: user.sellerProfile.id,
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl
        };

        try {
            const response = await fetch('/api/menu/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Item added successfully!');
                window.location.href = 'seller-menu.html';
            } else {
                alert('Failed to add item. Server error.');
            }
        } catch (err) {
            console.error(err);
            alert('Network error.');
        }
    });
});

// Function to handle image preview
function previewImage(event) {
    const preview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '<span class="image-placeholder"><i class="bi bi-image"></i></span>';
    }
}

// Helper to convert file to text
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});