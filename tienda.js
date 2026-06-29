/* ===========================
   PRODUCT DATA
   Cuando los equipos tengan nombre real, actualiza
   name y cofradia en cada producto.
   =========================== */

const PRICE = 18;

const products = [
  { id:1, name:'HUMILDAD',    cofradia:'Hdad. y Cofradía de Nazarenos del S Cristo de la Humildad en su Presentación Ante Pilato y Ntra. Madre Y Sra. de Consolación y Esperanza', primary:'#800020', secondary:'#ffffff', kit:'solid', kitImgA:'kits/HUMILDAD-A.png',    kitImgB:'kits/HUMILDAD-B.png'    },
  { id:2, name:'PADRE JESÚS', cofradia:'Hdad. de Ntro. Padre Jesús',              primary:'#6a1b9a', secondary:'#ffffff', kit:'solid', kitImgA:'kits/PADRE-JESUS-A.png',  kitImgB:'kits/PADRE-JESUS-B.png'  },
  { id:3, name:'RESUCITADO',         cofradia:'Cofradía del Santísimo Cristo Resucitado',          primary:'#c62828', secondary:'#ffffff', kit:'solid', kitImgA:'kits/RESUCITADO-A.png',  kitImgB:'kits/RESUCITADO-B.png'  },
  { id:4, name:'GRUPO JOVEN VERA CRUX', cofradia:'Cofradía de la Santa Vera Crux y Santiago Apóstol', primary:'#B5DCCA', secondary:'#000000', kit:'solid', kitImgA:'kits/GRUPO-JOVEN-A.png',  kitImgB:'kits/GRUPO-JOVEN-B.png'  },
  { id:5, name:'JESÚS CAÍDO',   cofradia:'Agrupación Musical Jesús Caído',                                              primary:'#0d1b4b', secondary:'#ffffff', kit:'solid', kitImgA:'kits/JESUS-CAIDO-A.png',    kitImgB:'kits/JESUS-CAIDO-B.png'    },
  { id:6, name:'SANTO ENTIERRO', cofradia:'Cofradía Sacramental del Santo Sepulcro y Ntra. Sra. de la Soledad', primary:'#1a1a1a', secondary:'#ffffff', kit:'solid', kitImgA:'kits/SANTO-ENTIERRO-A.png', kitImgB:'kits/SANTO-ENTIERRO-B.png' },
  { id:7, name:'IMPERIO ROMANO', cofradia:'Imperio Romano de Montoro',                                          primary:'#0000FD', secondary:'#ffffff', kit:'solid', kitImgA:'kits/ROMANOS-A.png',        kitImgB:'kits/ROMANOS-B.png'        },
];

const SIZES = ['2A', '4A', '6A', '8A', '10A', '12A', '14A', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

/* ===========================
   CART STATE (persisted)
   =========================== */

let cart = JSON.parse(localStorage.getItem('mcfs_cart') || '[]');

function saveCart() {
  localStorage.setItem('mcfs_cart', JSON.stringify(cart));
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

/* ===========================
   KIT SVG (same as equipos.js)
   =========================== */

function kitSVG(primary, secondary, style, size = 90) {
  const uid = 'k' + Math.random().toString(36).slice(2, 7);
  const body = `M 32,6 C 39,6 45,20 50,20 C 55,20 61,6 68,6 L 88,6 L 100,24 L 100,50 L 76,50 L 76,112 L 24,112 L 24,50 L 0,50 L 0,24 L 12,6 Z`;
  const collar = `M 36,6 C 42,6 47,18 50,18 C 53,18 58,6 64,6`;

  let defs = '', fill = primary;

  if (style === 'stripes_v') {
    defs = `<pattern id="${uid}" patternUnits="userSpaceOnUse" width="14" height="200">
      <rect width="7" height="200" fill="${primary}"/>
      <rect x="7" width="7" height="200" fill="${secondary}"/>
    </pattern>`;
    fill = `url(#${uid})`;
  } else if (style === 'hoops') {
    defs = `<pattern id="${uid}" patternUnits="userSpaceOnUse" width="200" height="16">
      <rect width="200" height="8"  fill="${primary}"/>
      <rect y="8" width="200" height="8" fill="${secondary}"/>
    </pattern>`;
    fill = `url(#${uid})`;
  } else if (style === 'halves') {
    defs = `<linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="50%" stop-color="${primary}"/>
      <stop offset="50%" stop-color="${secondary}"/>
    </linearGradient>`;
    fill = `url(#${uid})`;
  } else if (style === 'diagonal') {
    defs = `<linearGradient id="${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="48%" stop-color="${primary}"/>
      <stop offset="48%" stop-color="${secondary}"/>
    </linearGradient>`;
    fill = `url(#${uid})`;
  }

  return `<svg viewBox="0 0 100 118" width="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>${defs}</defs>
    <path d="${body}" fill="${fill}" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="${body}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="6" stroke-linejoin="round"/>
    <path d="${collar}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

/* ===========================
   RENDER SHOP GRID
   =========================== */

function renderShop() {
  const grid = document.getElementById('shopGrid');
  if (!grid) return;

  grid.innerHTML = products.map(p => {
    const hasImg = !!p.kitImgA;

    const kitArea = hasImg
      ? `<div class="product-kit-area product-kit-real">
           <img src="${p.kitImgA}" alt="Camiseta ${p.name}" class="product-kit-img" id="shop-kit-${p.id}">
           <div class="kit-variant-toggle">
             <button class="kvt-btn active" onclick="switchShopKit(${p.id},'A',this)">Delantera</button>
             <button class="kvt-btn"        onclick="switchShopKit(${p.id},'B',this)">Espalda</button>
           </div>
         </div>`
      : `<div class="product-kit-area">${kitSVG(p.primary, p.secondary, p.kit, 90)}</div>`;

    return `
      <div class="product-card" id="card-${p.id}">
        <div class="product-accent" style="background:${p.primary}"></div>
        ${kitArea}
        <div class="product-info">
          <p class="product-name">${p.name}</p>
          <p class="product-cofradia">${p.cofradia !== 'Por confirmar' ? p.cofradia : 'Cofradía por confirmar'}</p>
          <p class="product-price">${PRICE.toFixed(2).replace('.',',')} €</p>
        </div>
        <div class="size-selector">
          <span class="size-label">Talla</span>
          <div class="size-options" id="sizes-${p.id}">
            ${SIZES.map(s => `<button class="size-btn" data-size="${s}" onclick="selectSize(${p.id}, '${s}', this)">${s}</button>`).join('')}
          </div>
        </div>
        <div class="product-footer">
          <button class="btn-add-cart" id="addbtn-${p.id}" onclick="addToCart(${p.id})">
            🛒 Añadir al carrito
          </button>
        </div>
      </div>`;
  }).join('');
}

function switchShopKit(productId, variant, btn) {
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const img = document.getElementById(`shop-kit-${productId}`);
  if (img) img.src = variant === 'A' ? p.kitImgA : p.kitImgB;
  btn.closest('.kit-variant-toggle').querySelectorAll('.kvt-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ===========================
   SIZE SELECTION
   =========================== */

const selectedSizes = {};

function selectSize(productId, size, btn) {
  selectedSizes[productId] = size;
  const container = document.getElementById(`sizes-${productId}`);
  container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const addBtn = document.getElementById(`addbtn-${productId}`);
  addBtn.classList.remove('added');
  addBtn.textContent = '🛒 Añadir al carrito';
}

/* ===========================
   CART LOGIC
   =========================== */

function addToCart(productId) {
  const size = selectedSizes[productId];
  if (!size) {
    /* flash size selector */
    const label = document.querySelector(`#sizes-${productId}`).previousElementSibling;
    label.style.color = '#ff5252';
    setTimeout(() => label.style.color = '', 900);
    return;
  }

  const product = products.find(p => p.id === productId);
  const key = `${productId}-${size}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key, productId, size,
      name: product.name,
      primary: product.primary, secondary: product.secondary, kit: product.kit,
      price: PRICE, qty: 1,
    });
  }

  saveCart();
  renderCart();
  updateCartCount();

  /* Button feedback */
  const btn = document.getElementById(`addbtn-${productId}`);
  btn.classList.add('added');
  btn.textContent = '✓ Añadido';
  setTimeout(() => {
    btn.classList.remove('added');
    btn.textContent = '🛒 Añadir al carrito';
  }, 2000);

  /* Bump count badge */
  const badge = document.getElementById('cartCount');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);

  openCart();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  renderCart();
  updateCartCount();
}

/* ===========================
   RENDER CART
   =========================== */

function renderCart() {
  const itemsEl   = document.getElementById('cartItems');
  const emptyEl   = document.getElementById('cartEmpty');
  const footerEl  = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.classList.add('visible');
    footerEl.classList.remove('visible');
    return;
  }

  emptyEl.classList.remove('visible');
  footerEl.classList.add('visible');

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-kit">
        ${kitSVG(item.primary, item.secondary, item.kit, 56)}
      </div>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-size">Talla: ${item.size}</p>
        <p class="cart-item-price">${(item.price * item.qty).toFixed(2).replace('.',',')} €</p>
      </div>
      <div class="cart-item-controls">
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${item.key}', -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.key}', 1)">+</button>
        </div>
        <button class="cart-remove" onclick="removeItem('${item.key}')">Eliminar</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotalPrice').textContent =
    total.toFixed(2).replace('.', ',') + ' €';
}

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

/* ===========================
   CART DRAWER OPEN/CLOSE
   =========================== */

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
document.getElementById('cartOverlay').addEventListener('click', closeCartDrawer);

/* ===========================
   CHECKOUT
   =========================== */

function openCheckout() {
  if (cart.length === 0) return;
  closeCartDrawer();

  /* Build summary */
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('checkoutSummary').innerHTML = `
    ${cart.map(i => `
      <div class="summary-item">
        <span>${i.name} · Talla ${i.size} × ${i.qty}</span>
        <span class="summary-item-price">${(i.price * i.qty).toFixed(2).replace('.',',')} €</span>
      </div>
    `).join('')}
    <div class="summary-total">
      <span>Total del pedido</span>
      <span>${total.toFixed(2).replace('.',',')} €</span>
    </div>
  `;

  document.getElementById('checkoutForm').classList.remove('hidden');
  document.getElementById('checkoutSuccess').classList.add('hidden');
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
document.getElementById('checkoutOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeCheckout();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCheckout(); });

document.getElementById('orderForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!this.checkValidity()) { this.reportValidity(); return; }

  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const pedido   = cart.map(i =>
    `${i.name} · Talla ${i.size} × ${i.qty} = ${(i.price * i.qty).toFixed(2)} €`
  ).join('\n');

  const payload = JSON.stringify({
    nombre:    document.getElementById('coName').value,
    telefono:  document.getElementById('coPhone').value,
    email:     document.getElementById('coEmail').value,
    direccion: document.getElementById('coAddress').value,
    notas:     document.getElementById('coNotes').value,
    pedido,
    total:     total.toFixed(2) + ' €',
  });

  fetch('https://script.google.com/macros/s/AKfycbyVNWscTB2dOTmWVs6rFjqTps1U5CLI_BqOq6lEbIN6xEbaCxcx4szUBLJmmGF7mqK2-w/exec', {
    method:  'POST',
    mode:    'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body:    payload,
  }).catch(() => {});

  document.getElementById('successTotal').textContent =
    total.toFixed(2).replace('.', ',') + ' €';
  document.getElementById('checkoutForm').classList.add('hidden');
  document.getElementById('checkoutSuccess').classList.remove('hidden');
});

/* ===========================
   MOBILE NAV
   =========================== */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ===========================
   INIT
   =========================== */
renderShop();
renderCart();
updateCartCount();
