// โหลดสินค้าแบบ dynamic จาก localStorage (adminProducts) ถ้ามี
function getProducts() {
  return JSON.parse(localStorage.getItem('adminProducts') || 'null') || [
    { id: 'ice_small', name: 'น้ำแข็งเล็ก', price: 40, icon: '🧊', desc: 'น้ำแข็งก้อนเล็ก เหมาะกับเครื่องดื่ม' },
    { id: 'ice_crushed', name: 'น้ำแข็งบด', price: 40, icon: '🧊', desc: 'น้ำแข็งบดละเอียด เหมาะกับปั่น' },
    { id: 'ice_large', name: 'น้ำแข็งใหญ่', price: 40, icon: '🧊', desc: 'น้ำแข็งก้อนใหญ่ อยู่ได้นาน' },
    { id: 'gas_7kg', name: 'แก๊ส 7 กก.', price: 285, icon: '🛢️', desc: 'ถังแก๊สขนาด 7 กิโลกรัม' },
    { id: 'gas_15kg', name: 'แก๊ส 15 กก.', price: 490, icon: '🛢️', desc: 'ถังแก๊สขนาด 15 กิโลกรัม' },
    { id: 'gas_48kg', name: 'แก๊ส 48 กก.', price: 1490, icon: '🛢️', desc: 'ถังแก๊สขนาด 48 กิโลกรัม' },
    { id: 'bottle_350', name: 'น้ำดื่มขวด 350ml', price: 35, icon: '🧴', desc: 'แพ็ค 12 ขวด', min: 10 },
    { id: 'bottle_600', name: 'น้ำดื่มขวด 600ml', price: 42, icon: '🧴', desc: 'แพ็ค 12 ขวด', min: 10 },
    { id: 'bottle_820', name: 'น้ำดื่มขวด 820ml', price: 36, icon: '🧴', desc: 'แพ็ค 6 ขวด', min: 10 }
  ];
}

// PRODUCTS จะอัปเดตทุกครั้งที่ renderProducts
let PRODUCTS = getProducts();

// แก้ไข: กำหนด cart ให้โหลดจาก sessionStorage หรือเป็น object ว่าง
let cart = {};
try {
  cart = JSON.parse(sessionStorage.getItem('orderProducts')) || {};
} catch (e) {
  cart = {};
}

function renderProducts() {
  PRODUCTS = getProducts();
  const list = document.querySelector('.product-list');
  list.innerHTML = PRODUCTS.map(p => {
    const inCart = cart[p.id] && cart[p.id] > 0;
    // set min for water
    const min = p.min || 0;
    return `
      <div class="product-card${inCart ? ' in-cart' : ''}">
        <div class="product-icon" style="font-size:2.2em;text-align:center;margin-bottom:0.3em;">${p.icon}</div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div style="font-size:0.98em;color:#888;">${p.desc || ''}</div>
          <div class="product-price">฿${p.price}</div>
        </div>
        <div class="product-qty-group" role="group" aria-label="จำนวน ${p.name}">
          <button type="button" class="qty-btn" aria-label="ลดจำนวน" data-target="${p.id}">-</button>
          <input type="number" name="${p.id}" min="${min}" max="99" value="${cart[p.id]||min||0}" class="product-qty" aria-label="จำนวน ${p.name}">
          <button type="button" class="qty-btn" aria-label="เพิ่มจำนวน" data-target="${p.id}">+</button>
        </div>
      </div>
    `;
  }).join('');
}

function updateTotal() {
  let total = 0;
  for (const p of PRODUCTS) {
    const qty = cart[p.id] || 0;
    total += qty * p.price;
  }
  const totalPriceElem = document.getElementById('totalPrice');
  if (totalPriceElem) {
    totalPriceElem.textContent = `รวม: ฿${total.toLocaleString()}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.querySelector('.product-list').addEventListener('click', e => {
    if (e.target.classList.contains('qty-btn')) {
      const id = e.target.dataset.target;
      const input = document.querySelector(`.product-qty[name="${id}"]`);
      let val = parseInt(input.value) || 0;
      const prod = PRODUCTS.find(p => p.id === id);
      const min = prod && prod.min ? prod.min : 0;
      if (e.target.textContent === '+') val = Math.min(val + 1, 99);
      if (e.target.textContent === '-') val = Math.max(val - 1, min);
      input.value = val;
      cart[id] = val;
      updateTotal();
      sessionStorage.setItem('orderProducts', JSON.stringify(cart));
    }
  });
  document.querySelectorAll('.product-qty').forEach(input => {
    input.addEventListener('input', function() {
      let val = Math.max(parseInt(this.min)||0, Math.min(99, parseInt(this.value) || 0));
      this.value = val;
      cart[this.name] = val;
      updateTotal();
      sessionStorage.setItem('orderProducts', JSON.stringify(cart));
    });
  });
  document.getElementById('productForm').addEventListener('submit', e => {
    e.preventDefault();
    // Remove zero qty and check min for water
    Object.keys(cart).forEach(k => {
      const prod = PRODUCTS.find(p => p.id === k);
      const min = prod && prod.min ? prod.min : 0;
      if (!cart[k] || cart[k] < min) delete cart[k];
    });
    if (Object.keys(cart).length === 0) {
      alert('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ (น้ำดื่มขั้นต่ำ 10 แพ็ค)');
      return;
    }
    sessionStorage.setItem('orderProducts', JSON.stringify(cart));
    window.location.href = 'form.html';
  });
  updateTotal();
});