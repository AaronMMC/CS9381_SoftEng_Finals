document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('addForm');
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const availableInput = document.getElementById('available');
  const imgInput = document.getElementById('img');
  const typeInput = document.getElementById('type');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // For demo: just validate and show success
    if (!nameInput.value.trim()) {
      alert('Please enter item name');
      return;
    }
    if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    alert('Item added successfully!');
    form.reset();
    availableInput.value = 'true';
    window.location.href = 'seller-menu.html';

    // Future: when connected to backend, use this:
    // const payload = {
    //   name: nameInput.value,
    //   price: parseFloat(priceInput.value) || 0,
    //   available: availableInput.value === 'true',
    //   img: imgInput.value,
    //   type: typeInput.value,
    //   sellerId: sellerProfile.id
    // };
    // fetch('/api/menu/add', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // })
    //   .then(res => {
    //     if (!res.ok) throw new Error('Create failed');
    //     window.location.href = 'seller-menu.html';
    //   })
    //   .catch(err => alert('Failed to create item'));
  });
});
