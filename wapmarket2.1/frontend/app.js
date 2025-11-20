// frontend app.js
const API = '/api';
let products = [];
let categories = [];
let cart = [];
let ADMIN_PHONE = '+240555218661';
let SHIPPING_COST = 2000;

function fmt(x){ return Number(x).toLocaleString('en-US'); }

async function fetchConfig(){
  try{
    const res = await fetch(API+'/config');
    const cfg = await res.json();
    ADMIN_PHONE = cfg.admin_phone || ADMIN_PHONE;
    SHIPPING_COST = cfg.shipping_cost || SHIPPING_COST;
    document.getElementById('shipping-cost-label').innerText = SHIPPING_COST.toLocaleString();
  }catch(e){ console.warn('No config available', e); }
}

async function fetchCategories(){
  const res = await fetch(API+'/products'); // products endpoint returns category too
  const all = await res.json();
  // derive categories
  const map = {};
  all.forEach(p=>{ if(p.category){ map[p.category]=true; } });
  categories = Object.keys(map);
  renderCategories();
}

async function fetchProducts(){
  const res = await fetch(API+'/products');
  products = await res.json();
  renderProducts(products);
}

async function fetchBanners(){
  const res = await fetch(API+'/banners');
  const banners = await res.json();
  const area = document.getElementById('banner-area');
  area.innerHTML = '';
  banners.forEach(b=>{
    const el = document.createElement('div'); el.className='banner card';
    el.innerHTML = `<img src="${b.image_url}" alt="${b.title}"><div style="padding:12px"><h3>${b.title}</h3><p>${b.description}</p></div>`;
    area.appendChild(el);
  });
}

function renderCategories(){
  const el = document.getElementById('categories');
  el.innerHTML = '<li><button onclick="filterBy(null)">Todas</button></li>';
  categories.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<button onclick="filterBy('${c}')">${c}</button>`;
    el.appendChild(li);
  });
}

function filterBy(category){
  if(!category) renderProducts(products);
  else renderProducts(products.filter(p=>p.category===category));
}

function renderProducts(list){
  const el = document.getElementById('products');
  el.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description || ''}</p>
      <div class="meta">
        <div>
          <div class="badge">${p.brand || ''}</div>
          <div style="font-weight:700;margin-top:6px">${fmt(p.price)} XAF</div>
        </div>
        <div><button class="btn" onclick="addToCart(${p.id})">Añadir</button></div>
      </div>
    `;
    el.appendChild(card);
  });
  updateCartCount();
}

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const existing = cart.find(x=>x.product_id===id);
  if(existing){ existing.quantity += 1; } else { cart.push({product_id:id, quantity:1, name:p.name, price:p.price}); }
  updateCartCount();
  openCart();
}

function updateCartCount(){ document.getElementById('cart-count').innerText = cart.reduce((s,i)=>s+i.quantity,0); }

function openCart(){ document.getElementById('cart-modal').style.display='flex'; renderCartItems(); }
function closeCart(){ document.getElementById('cart-modal').style.display='none'; }

function renderCartItems(){
  const list = document.getElementById('cart-items'); list.innerHTML='';
  cart.forEach((it, idx)=>{
    const d = document.createElement('div'); d.className='card'; d.style.marginBottom='8px';
    d.innerHTML = `<strong>${it.name}</strong> - ${it.quantity} x ${fmt(it.price)} XAF
      <div style="margin-top:8px"><button onclick="changeQty(${idx},-1)">-</button>
      <button onclick="changeQty(${idx},1)">+</button>
      <button onclick="removeItem(${idx})">Eliminar</button></div>`;
    list.appendChild(d);
  });
  calculateTotals();
}

function changeQty(i,delta){ cart[i].quantity += delta; if(cart[i].quantity<=0) cart.splice(i,1); renderCartItems(); updateCartCount(); }
function removeItem(i){ cart.splice(i,1); renderCartItems(); updateCartCount(); }

function calculateTotals(){
  const shipping = document.getElementById('shipping-checkbox').checked;
  const subtotal = cart.reduce((s,i)=>s + (i.price*i.quantity),0);
  const shipping_cost = shipping ? SHIPPING_COST : 0;
  const total = subtotal + shipping_cost;
  document.getElementById('subtotal').innerText = subtotal.toLocaleString();
  document.getElementById('shipping-cost').innerText = shipping_cost.toLocaleString();
  document.getElementById('total').innerText = total.toLocaleString();
}

document.getElementById('view-cart').addEventListener('click', openCart);
document.getElementById('close-cart-btn').addEventListener('click', closeCart);

document.getElementById('place-order-btn').addEventListener('click', async ()=>{
  if(cart.length===0){ alert('Carrito vacío'); return; }
  const name = prompt('Nombre del cliente:');
  const phone = prompt('Teléfono:');
  const address = prompt('Dirección (si aplica):');
  const shipping = document.getElementById('shipping-checkbox').checked;
  const res = await fetch(API+'/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({customer_name:name, phone, address, items:cart, shipping})});
  if(res.ok){ alert('Pedido recibido. La empresa lo gestionará.'); cart=[]; closeCart(); updateCartCount(); } else alert('Error al enviar pedido');
});

document.getElementById('place-order-whatsapp-btn').addEventListener('click', async ()=>{
  if(cart.length===0){ alert('Carrito vacío'); return; }
  const name = prompt('Nombre del cliente:');
  const phone = prompt('Teléfono:');
  const address = prompt('Dirección (si aplica):');
  const shipping = document.getElementById('shipping-checkbox').checked;
  // Save order to backend
  await fetch(API+'/orders', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({customer_name:name, phone, address, items:cart, shipping})});
  // Build WhatsApp message and open chat
  const lines = []; lines.push('Nuevo pedido WapMarket'); lines.push('Cliente: '+name); lines.push('Tel: '+phone); if(address) lines.push('Dir: '+address); lines.push('---- Items ----');
  cart.forEach(it=> lines.push(`${it.name} x${it.quantity} - ${it.price} XAF`));
  const subtotal = cart.reduce((s,i)=>s + (i.price*i.quantity),0); const shipping_cost = shipping ? SHIPPING_COST : 0; const total = subtotal + shipping_cost;
  lines.push(`Subtotal: ${subtotal} XAF`); lines.push(`Envío: ${shipping_cost} XAF`); lines.push(`Total: ${total} XAF`);
  const text = encodeURIComponent(lines.join('\\n'));
  const waUrl = `https://wa.me/${ADMIN_PHONE.replace('+','')}?text=${text}`;
  window.open(waUrl, '_blank');
});

window.onload = async ()=>{
  await fetchConfig();
  await fetchProducts();
  await fetchCategories();
  await fetchBanners();
};
