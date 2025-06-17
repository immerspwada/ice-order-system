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
    const isWater = p.id && p.id.startsWith('bottle_');
    let qty = cart[p.id] || 0;
    // ถ้าเป็นน้ำและยังไม่ได้เลือก qty ให้แสดง 0
    if (isWater && !cart.hasOwnProperty(p.id)) qty = 0;
    return `
      <div class="product-card${qty > 0 ? ' in-cart' : ''}">
        <div class="product-icon" style="font-size:2.2em;text-align:center;margin-bottom:0.3em;">${p.icon}</div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div style="font-size:0.98em;color:#888;">${p.desc || ''}</div>
          <div class="product-price">฿${p.price}</div>
        </div>
        <div class="product-qty-group" role="group" aria-label="จำนวน ${p.name}">
          <button type="button" class="qty-btn" aria-label="ลดจำนวน" data-target="${p.id}">-</button>
          <input type="number" name="${p.id}" min="0" max="99" value="${qty}" class="product-qty" aria-label="จำนวน ${p.name}">
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

function showPopup(msg) {
  let popup = document.getElementById('orderPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'orderPopup';
    popup.style = 'position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.18);z-index:9999;display:flex;align-items:center;justify-content:center;';
    popup.innerHTML = `<div style='background:#fffbe7;padding:2em 1.2em;border-radius:16px;max-width:90vw;box-shadow:0 2px 16px #FFA726;min-width:220px;text-align:center;'>
      <div style='font-weight:700;color:#d32f2f;margin-bottom:1.2em;'>${msg}</div>
      <button id='closeOrderPopup' style='background:#FFA726;color:#fff;border:none;padding:0.7em 1.5em;border-radius:8px;font-weight:700;'>ปิด</button>
    </div>`;
    document.body.appendChild(popup);
    document.getElementById('closeOrderPopup').onclick = function() {
      popup.remove();
    };
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
      const isWater = id && id.startsWith('bottle_');
      if (e.target.textContent === '+') {
        if (isWater && val === 0) {
          cart[id] = 10;
        } else {
          cart[id] = Math.min((cart[id]||0) + 1, 99);
        }
      } else if (e.target.textContent === '-') {
        if (isWater && val === 10) {
          cart[id] = 0;
        } else {
          cart[id] = Math.max((cart[id]||0) - 1, 0);
        }
      }
      input.value = cart[id];
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
      showPopup('กรุณาเลือกสินค้าอย่างน้อย 1 รายการ (น้ำดื่มขั้นต่ำ 10 แพ็ค)');
      return;
    }
    sessionStorage.setItem('orderProducts', JSON.stringify(cart));
    window.location.href = 'form.html';
  });
  updateTotal();
});