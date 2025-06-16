// admin.js - LUCKY Delivery Admin Panel
// 1. แก้ไขสินค้า/ราคา (บันทึกใน localStorage)
// 2. ดู/จัดการรายการสั่งซื้อ (localStorage)

const defaultProducts = [
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

function getProducts() {
  return JSON.parse(localStorage.getItem('adminProducts') || 'null') || defaultProducts;
}
function saveProducts(products) {
  localStorage.setItem('adminProducts', JSON.stringify(products));
}

function renderProductAdmin() {
  const products = getProducts();
  const div = document.getElementById('productAdmin');
  div.innerHTML = `<table style="width:100%;max-width:700px;margin:auto;border-collapse:collapse;">
    <tr style="background:#fffbe7;font-weight:700;color:#BFA600;"><th>ไอคอน</th><th>ชื่อสินค้า</th><th>ราคา</th><th>ขั้นต่ำ</th><th>ลบ</th></tr>
    ${products.map((p,i)=>`
      <tr>
        <td style="font-size:1.7em;text-align:center;">${p.icon}</td>
        <td><input type="text" value="${p.name}" data-idx="${i}" data-field="name" style="width:120px;"></td>
        <td><input type="number" value="${p.price}" min="0" data-idx="${i}" data-field="price" style="width:70px;"></td>
        <td><input type="number" value="${p.min||0}" min="0" data-idx="${i}" data-field="min" style="width:60px;"></td>
        <td><button class="del-prod-btn" data-idx="${i}" style="color:#d32f2f;font-weight:700;">ลบ</button></td>
      </tr>
    `).join('')}
    <tr><td colspan="5" style="text-align:center;padding:1em 0;">
      <button id="addProductBtn" class="btn-main" style="background:#ffe082;color:#BFA600;">+ เพิ่มสินค้าใหม่</button>
    </td></tr>
  </table>`;
}

document.getElementById('productAdmin').onclick = function(e) {
  if (e.target.classList.contains('del-prod-btn')) {
    const idx = +e.target.dataset.idx;
    if (confirm('ลบสินค้านี้?')) {
      const products = getProducts();
      products.splice(idx,1);
      saveProducts(products);
      renderProductAdmin();
    }
  }
  if (e.target.id === 'addProductBtn') {
    const products = getProducts();
    products.push({ id: 'new_'+Date.now(), name: '', price: 0, icon: '', desc: '', min: 0 });
    saveProducts(products);
    renderProductAdmin();
  }
};

document.getElementById('saveProductsBtn').onclick = function() {
  const products = getProducts();
  document.querySelectorAll('#productAdmin input').forEach(input => {
    const idx = +input.dataset.idx;
    const field = input.dataset.field;
    if (field === 'price' || field === 'min') products[idx][field] = +input.value;
    else products[idx][field] = input.value;
  });
  saveProducts(products);
  alert('บันทึกสินค้า/ราคาเรียบร้อย');
};

renderProductAdmin();

// --- Order log (mock: localStorage) ---
function getOrders() {
  return JSON.parse(localStorage.getItem('adminOrders') || '[]');
}
function saveOrders(orders) {
  localStorage.setItem('adminOrders', JSON.stringify(orders));
}
function renderOrders() {
  const orders = getOrders();
  const div = document.getElementById('ordersAdmin');
  if (!orders.length) {
    div.innerHTML = '<div style="color:#d32f2f;text-align:center;">ยังไม่มีรายการสั่งซื้อ</div>';
    return;
  }
  div.innerHTML = `<table style="width:100%;max-width:900px;margin:auto;border-collapse:collapse;">
    <tr style="background:#fffbe7;font-weight:700;color:#BFA600;"><th>วัน-เวลา</th><th>ชื่อ</th><th>โทร</th><th>ที่อยู่</th><th>สินค้า</th><th>slip</th><th>ลบ</th></tr>
    ${orders.map((o,i)=>`
      <tr>
        <td style="font-size:0.98em;">${o.datetime||'-'}</td>
        <td><input type="text" value="${o.name||''}" data-idx="${i}" data-field="name" style="width:90px;"></td>
        <td><input type="text" value="${o.phone||''}" data-idx="${i}" data-field="phone" style="width:90px;"></td>
        <td><textarea data-idx="${i}" data-field="address" style="width:120px;">${o.address||''}</textarea></td>
        <td style="font-size:0.98em;">${Object.values(o.products||{}).filter(p=>p.qty>0).map(p=>`${p.name} x${p.qty}`).join('<br>')}</td>
        <td>${o.slip?`<a href="${o.slip}" target="_blank">ดู</a>`:'-'}</td>
        <td><button class="del-order-btn" data-idx="${i}" style="color:#d32f2f;font-weight:700;">ลบ</button></td>
      </tr>
    `).join('')}
  </table>
  <div style="text-align:right;margin:1em 0;">
    <button id="exportOrdersBtn" class="btn-main" style="background:#ffe082;color:#BFA600;">Export รายการสั่งซื้อ (CSV)</button>
    <button id="saveOrdersBtn" class="btn-main" style="background:#ffe082;color:#BFA600;">บันทึกการแก้ไข</button>
  </div>`;
}

document.getElementById('ordersAdmin').onclick = function(e) {
  if (e.target.classList.contains('del-order-btn')) {
    const idx = +e.target.dataset.idx;
    if (confirm('ลบออเดอร์นี้?')) {
      const orders = getOrders();
      orders.splice(idx,1);
      saveOrders(orders);
      renderOrders();
    }
  }
  if (e.target.id === 'exportOrdersBtn') {
    const orders = getOrders();
    let csv = 'วันเวลา,ชื่อ,โทร,ที่อยู่,สินค้า\n';
    orders.forEach(o => {
      const prod = Object.values(o.products||{}).filter(p=>p.qty>0).map(p=>`${p.name} x${p.qty}`).join('; ');
      csv += `"${o.datetime||''}","${o.name||''}","${o.phone||''}","${o.address||''}","${prod}"
`;
    });
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }
  if (e.target.id === 'saveOrdersBtn') {
    const orders = getOrders();
    document.querySelectorAll('#ordersAdmin input, #ordersAdmin textarea').forEach(input => {
      const idx = +input.dataset.idx;
      const field = input.dataset.field;
      orders[idx][field] = input.value;
    });
    saveOrders(orders);
    alert('บันทึกการแก้ไขออเดอร์เรียบร้อย');
  }
};
renderOrders();
