const products = [
  { name: "Chocolate Cake", image: "https://t4.ftcdn.net/jpg/03/05/27/25/240_F_305272587_nv5RrWvFWM5u1UhsLYXQ60lTdp8xbDAE.jpg", price: 12.99, category: "Cakes", description: "Rich chocolate cake with creamy frosting" },
  { name: "Banana Bread", image: "https://t4.ftcdn.net/jpg/03/05/27/25/240_F_305272587_nv5RrWvFWM5u1UhsLYXQ60lTdp8xbDAE.jpg", price: 8.49, category: "Breads", description: "Moist banana bread with walnuts" },
  { name: "Blueberry Muffins", image: "https://t4.ftcdn.net/jpg/11/66/81/47/240_F_1166814778_RDIDYCOPUbka7JbgOs3CHeQN5uOMtUkM.jpg", price: 6.75, category: "Muffins", description: "Fresh blueberry muffins (pack of 6)" },
  { name: "Chocolate Chip Cookies", image: "https://t4.ftcdn.net/jpg/00/96/25/47/240_F_96254713_5tNAaUXMLKRUwk5XpYzYKWSqWUFXUcfP.jpg", price: 3.00, category: "Cookies", description: "Classic chocolate chip cookies (pack of 12)" },
  { name: "Cake Pops", image: "https://t3.ftcdn.net/jpg/08/16/11/88/240_F_816118821_4ALuopEY8qzJZ1RyvcL7PSVVlmMVfAzZ.jpg", price: 3.50, category: "Treats", description: "Decorated cake pops (pack of 6)" },
  { name: "Sweet Tarts", image: "https://images.unsplash.com/photo-1542761923-d1909278b75d?w=400&fit=crop", price: 3.00, category: "Pastries", description: "Mini fruit tarts with pastry cream" },
  { name: "Croissant", image: "https://images.unsplash.com/photo-1691480162735-9b91238080f6?w=400&fit=crop", price: 2.50, category: "Pastries", description: "Buttery, flaky French croissant" },
  { name: "Garlic Bread", image: "https://vikalinka.com/wp-content/uploads/2021/03/Garlic-Butter-Dinner-Rolls-11-Edit.jpg", price: 4.00, category: "Breads", description: "Warm garlic butter bread rolls" },
  { name: "Strawberry Cheesecake", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&fit=crop", price: 15.99, category: "Cakes", description: "Creamy cheesecake with fresh strawberries" },
  { name: "Cinnamon Rolls", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop", price: 7.50, category: "Pastries", description: "Warm cinnamon rolls with glaze (pack of 4)" },
  { name: "Apple Pie", image: "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&fit=crop", price: 14.99, category: "Pies", description: "Traditional apple pie with flaky crust" },
  { name: "Sourdough Loaf", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop", price: 5.99, category: "Breads", description: "Artisan sourdough bread loaf" },
];

let cartItems = [];

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('bb_cart');
  if (saved) { try { cartItems = JSON.parse(saved); } catch(e) { cartItems = []; } }
  updateCartUI();

  const saved_dark = localStorage.getItem('bb_dark');
  if (saved_dark === 'true') document.body.classList.add('dark-mode');

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(61,43,31,0.12)' : '';
    });
  }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('bb_dark', document.body.classList.contains('dark-mode'));
}

function toggleMobileNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  const overlay = document.querySelector('.cart-overlay');
  if (panel) panel.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');
}

function addToCart(index) {
  const p = products[index];
  const existing = cartItems.find(i => i.name === p.name);
  if (existing) { existing.quantity += 1; }
  else { cartItems.push({ name: p.name, price: p.price, quantity: 1 }); }
  saveCart();
  updateCartUI();
  showToast(`${p.name} added to cart!`);
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const list = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (!list) return;

  list.innerHTML = '';
  let totalItems = 0;
  let grand = 0;

  cartItems.forEach((item, i) => {
    totalItems += item.quantity;
    const itemTotal = item.price * item.quantity;
    grand += itemTotal;
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.name}</strong><br>Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}<br><button onclick="removeFromCart(${i})">Remove</button>`;
    list.appendChild(li);
  });

  const totalLi = document.createElement('li');
  totalLi.style.cssText = 'font-weight:700;font-size:1rem;border-top:2px solid var(--border);margin-top:0.5rem;padding-top:0.75rem;border-bottom:none;';
  totalLi.textContent = `Grand Total: $${grand.toFixed(2)}`;
  list.appendChild(totalLi);

  if (count) count.textContent = totalItems;
  if (totalEl) totalEl.textContent = grand.toFixed(2);
}

function saveCart() { localStorage.setItem('bb_cart', JSON.stringify(cartItems)); }

function checkout() {
  if (!cartItems.length) { showToast('Your cart is empty!'); return; }
  showToast('Thank you for your purchase! 🎉');
  cartItems = [];
  saveCart();
  updateCartUI();
  toggleCart();
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function submitReview(event) {
  event.preventDefault();
  const name = event.target.querySelector('input[type="text"]').value;
  const rating = event.target.querySelector('select').value;
  showToast(`Thanks ${name} for your ${rating}-star review!`);
  event.target.reset();
}

function registerForEvent(type) {
  const names = { 'bread-making': 'Beginner Bread Making', 'cookie-decorating': 'Kids Cookie Decorating', 'holiday-cakes': 'Holiday Cake Decorating', 'sourdough': 'Sourdough Masterclass' };
  showToast(`Registered for ${names[type] || type}!`);
}

function signupLoyalty(event) {
  event.preventDefault();
  const name = event.target.querySelector('input[type="text"]').value;
  showToast(`Welcome to B&B Rewards, ${name}!`);
  event.target.reset();
}

function checkOrderStatus(event) {
  event.preventDefault();
  const num = event.target.querySelector('input[type="text"]').value;
  const statuses = ['Preparing', 'Baking', 'Ready for Pickup', 'Out for Delivery', 'Completed'];
  showToast(`Order #${num}: ${statuses[Math.floor(Math.random() * statuses.length)]}`);
  event.target.reset();
}

function submitCateringRequest(event) {
  event.preventDefault();
  const name = event.target.querySelector('input[type="text"]').value;
  const d = event.target.querySelector('input[type="date"]').value;
  showToast(`Thanks ${name}! We'll contact you about your ${d} event within 24hrs.`);
  event.target.reset();
}
