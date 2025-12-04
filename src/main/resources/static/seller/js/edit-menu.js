document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('editForm');
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const availableInput = document.getElementById('available');
  const imgInput = document.getElementById('img');
  const typeInput = document.getElementById('type');

  // Sample menu data (same as in menu.js for demo)
  const SAMPLE_MENU = [
    { id: 1, name: "Pinakbet", price: 80, available: true, img: "/user/img/Pinakbet.jpg", type: "ulam" },
    { id: 2, name: "Sisig", price: 100, available: true, img: "/user/img/Sisig.webp", type: "ulam" },
    { id: 3, name: "Rice", price: 20, available: true, img: "/user/img/Rice.webp", type: "merienda" },
    { id: 4, name: "Sinigang", price: 100, available: false, img: "/user/img/Sinigang.jpg", type: "ulam" },
    { id: 5, name: "Fried Chicken", price: 60, available: true, img: "/user/img/Chicken.jpg", type: "ulam" },
    { id: 6, name: "Giniling", price: 80, available: true, img: "/user/img/Giniling.jpg", type: "ulam" },
  ];

  const editingFoodId = parseInt(sessionStorage.getItem('editingFoodId'), 10);
  if (!editingFoodId) { 
    alert('No item selected'); 
    window.location.href = 'seller-menu.html'; 
    return; 
  }

  // Find item in sample menu
  const item = SAMPLE_MENU.find(i => i.id === editingFoodId);
  if (!item) { 
    alert('Item not found'); 
    window.location.href = 'seller-menu.html'; 
    return; 
  }

  // Populate form with item data
  nameInput.value = item.name || '';
  priceInput.value = item.price || 0;
  availableInput.value = item.available ? 'true' : 'false';
  imgInput.value = item.img || '';
  typeInput.value = item.type || 'ulam';

  // Update image preview
  if (item.img) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    preview.innerHTML += '<button type="button" class="image-edit-btn" onclick="document.getElementById(\'img\').focus()"><i class="bi bi-pencil"></i></button>';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // For demo: just show success and redirect
    alert('Item updated successfully!');
    sessionStorage.removeItem('editingFoodId');
    window.location.href = 'seller-menu.html';

    // Future: when connected to backend, use this:
    // const payload = {
    //   name: nameInput.value,
    //   price: parseFloat(priceInput.value) || 0,
    //   available: availableInput.value === 'true',
    //   img: imgInput.value,
    //   type: typeInput.value
    // };
    // fetch(`/api/menu/${editingFoodId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
    //   .then(res => {
    //     if (!res.ok) throw new Error('Update failed');
    //     sessionStorage.removeItem('editingFoodId');
    //     window.location.href = 'seller-menu.html';
    //   })
    //   .catch(err => alert('Failed to update item'));
  });
});
