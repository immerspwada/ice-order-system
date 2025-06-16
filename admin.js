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

// --- Loading indicator ทุกจุดที่มีการประมวลผล ---
function withLoading(fn) {
  return async function(...args) {
    if (window.showGlobalLoading) window.showGlobalLoading();
    try {
      await fn.apply(this, args);
    } finally {
      if (window.hideGlobalLoading) window.hideGlobalLoading();
    }
  };
}

// --- ใช้กับฟังก์ชันที่มีการประมวลผล ---
document.getElementById('saveProductsBtn').onclick = withLoading(function() {
  const products = getProducts();
  document.querySelectorAll('#productAdmin input').forEach(input => {
    const idx = +input.dataset.idx;
    const field = input.dataset.field;
    if (field === 'price' || field === 'min') products[idx][field] = +input.value;
    else products[idx][field] = input.value;
  });
  saveProducts(products);
  alert('บันทึกสินค้า/ราคาเรียบร้อย');
  renderProductAdmin();
});

document.getElementById('ordersAdmin').onclick = withLoading(function(e) {
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
    renderOrders();
  }
});

document.getElementById('productAdmin').onclick = withLoading(function(e) {
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
});

document.getElementById('ordersAdmin').addEventListener('click', function(e) {
  if (e.target.classList.contains('notify-btn')) {
    withLoading(showOrderMessagePopup)(+e.target.dataset.idx);
  }
});

// --- Order log (mock: localStorage) ---
function getOrders() {
  return JSON.parse(localStorage.getItem('adminOrders') || '[]');
}
function saveOrders(orders) {
  localStorage.setItem('adminOrders', JSON.stringify(orders));
}
// --- ระบบค้นหา/กรองออเดอร์, เปลี่ยนสถานะ, แจ้งเตือนลูกค้า ---
document.getElementById('orderSearch').addEventListener('input', function() {
  renderOrders(this.value.trim());
});

function renderOrders(search = '') {
  const orders = getOrders();
  const div = document.getElementById('ordersAdmin');
  let filtered = orders;
  if (search) {
    const s = search.toLowerCase();
    filtered = orders.filter(o =>
      (o.name||'').toLowerCase().includes(s) ||
      (o.phone||'').toLowerCase().includes(s) ||
      (o.status||'').toLowerCase().includes(s)
    );
  }
  if (!filtered.length) {
    div.innerHTML = '<div style="color:#d32f2f;text-align:center;">ไม่พบออเดอร์</div>';
    return;
  }
  div.innerHTML = `<table style="width:100%;max-width:900px;margin:auto;border-collapse:collapse;">
    <tr style="background:#fffbe7;font-weight:700;color:#BFA600;"><th>วัน-เวลา</th><th>ชื่อ</th><th>โทร</th><th>ที่อยู่</th><th>สินค้า</th><th>slip</th><th>สถานะ</th><th>แจ้งลูกค้า</th><th>ลบ</th></tr>
    ${filtered.map((o,i)=>`
      <tr>
        <td style="font-size:0.98em;">${o.datetime||'-'}</td>
        <td><input type="text" value="${o.name||''}" data-idx="${i}" data-field="name" style="width:90px;"></td>
        <td><input type="text" value="${o.phone||''}" data-idx="${i}" data-field="phone" style="width:90px;"></td>
        <td><textarea data-idx="${i}" data-field="address" style="width:120px;">${o.address||''}</textarea></td>
        <td style="font-size:0.98em;">${Object.values(o.products||{}).filter(p=>p.qty>0).map(p=>`${p.name} x${p.qty}`).join('<br>')}</td>
        <td>${o.slip?`<a href="${o.slip}" target="_blank">ดู</a>`:'-'}</td>
        <td>
          <select data-idx="${i}" data-field="status" class="order-status">
            <option value="pending" ${o.status==='pending'?'selected':''}>รอดำเนินการ</option>
            <option value="shipped" ${o.status==='shipped'?'selected':''}>จัดส่งแล้ว</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>ยกเลิก</option>
          </select>
        </td>
        <td><button class="notify-btn" data-idx="${i}" style="color:#FFA726;font-weight:700;">แจ้งลูกค้า</button></td>
        <td><button class="del-order-btn" data-idx="${i}" style="color:#d32f2f;font-weight:700;">ลบ</button></td>
      </tr>
    `).join('')}
  </table>
  <div style="text-align:right;margin:1em 0;">
    <button id="exportOrdersBtn" class="btn-main" style="background:#ffe082;color:#BFA600;">Export รายการสั่งซื้อ (CSV)</button>
    <button id="saveOrdersBtn" class="btn-main" style="background:#ffe082;color:#BFA600;">บันทึกการแก้ไข</button>
  </div>`;
}

// --- แจ้งเตือนออเดอร์ใหม่ (เสียง/Popup) ---
let lastOrderCount = getOrders().length;
setInterval(() => {
  const nowCount = getOrders().length;
  if (nowCount > lastOrderCount) {
    // เล่นเสียงแจ้งเตือน
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c7b.mp3');
    audio.play();
    alert('มีออเดอร์ใหม่เข้ามา!');
    lastOrderCount = nowCount;
    renderAdminDashboard();
    renderOrders(document.getElementById('orderSearch').value.trim());
  }
}, 5000);

// --- เปลี่ยนสถานะ/แจ้งเตือนลูกค้า ---
document.getElementById('ordersAdmin').addEventListener('change', function(e) {
  if (e.target.classList.contains('order-status')) {
    const idx = +e.target.dataset.idx;
    const orders = getOrders();
    orders[idx].status = e.target.value;
    saveOrders(orders);
    renderOrders(document.getElementById('orderSearch').value.trim());
  }
});
// --- ตัวอย่างการใช้ loading indicator ---
async function notifyCustomerFlex(idx) {
  if (window.showGlobalLoading) window.showGlobalLoading();
  const orders = getOrders();
  const order = orders[idx];
  try {
    await fetch('https://your-backend/send-flex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: order.lineUserId,
        order: order,
        status: order.status
      })
    });
    alert('แจ้งเตือนลูกค้าเรียบร้อย');
  } catch {
    alert('แจ้งเตือนลูกค้าไม่สำเร็จ');
  }
  if (window.hideGlobalLoading) window.hideGlobalLoading();
}
document.getElementById('ordersAdmin').addEventListener('click', function(e) {
  if (e.target.classList.contains('notify-btn')) {
    const idx = +e.target.dataset.idx;
    notifyCustomerFlex(idx);
  }
});

// --- แจ้งเตือนลูกค้าเป็นข้อความ text แทน Flex ---
async function notifyCustomerText(idx) {
  if (window.showGlobalLoading) window.showGlobalLoading();
  const orders = getOrders();
  const order = orders[idx];
  // สร้างข้อความสรุปสถานะ
  const statusText = order.status === 'shipped' ? 'จัดส่งแล้ว' : order.status === 'cancelled' ? 'ยกเลิก' : 'รอดำเนินการ';
  const total = Object.values(order.products||{}).reduce((sum,p)=>sum+(p.price||0)*(p.qty||0),0);
  const prodList = Object.values(order.products||{}).filter(p=>p.qty>0).map(p=>`${p.name} x${p.qty}`).join(', ');
  const msg = `ขอบคุณที่สั่งซื้อกับ LUCKY Delivery\n\nเลขที่ออเดอร์: ${order.id||'-'}\nชื่อ: ${order.name||'-'}\nสินค้า: ${prodList}\nยอดรวม: ฿${total}\nสถานะ: ${statusText}\n\nสอบถามเพิ่มเติมติดต่อแอดมินได้เลยค่ะ`;
  try {
    await fetch('https://your-backend/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: order.lineUserId,
        message: msg
      })
    });
    alert('แจ้งเตือนลูกค้าเรียบร้อย');
  } catch {
    alert('แจ้งเตือนลูกค้าไม่สำเร็จ');
  }
  if (window.hideGlobalLoading) window.hideGlobalLoading();
}
document.getElementById('ordersAdmin').addEventListener('click', function(e) {
  if (e.target.classList.contains('notify-btn')) {
    const idx = +e.target.dataset.idx;
    notifyCustomerText(idx);
  }
});

// --- เพิ่ม loading ตอน export, save, fetch ---
document.getElementById('ordersAdmin').onclick = function(e) {
  if (e.target.classList.contains('del-order-btn')) {
    const idx = +e.target.dataset.idx;
    if (confirm('ลบออเดอร์นี้?')) {
      if (window.showGlobalLoading) window.showGlobalLoading();
      const orders = getOrders();
      orders.splice(idx,1);
      saveOrders(orders);
      renderOrders();
      if (window.hideGlobalLoading) window.hideGlobalLoading();
    }
  }
  if (e.target.id === 'exportOrdersBtn') {
    if (window.showGlobalLoading) window.showGlobalLoading();
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
    if (window.hideGlobalLoading) window.hideGlobalLoading();
  }
  if (e.target.id === 'saveOrdersBtn') {
    if (window.showGlobalLoading) window.showGlobalLoading();
    const orders = getOrders();
    document.querySelectorAll('#ordersAdmin input, #ordersAdmin textarea').forEach(input => {
      const idx = +input.dataset.idx;
      const field = input.dataset.field;
      orders[idx][field] = input.value;
    });
    saveOrders(orders);
    alert('บันทึกการแก้ไขออเดอร์เรียบร้อย');
    if (window.hideGlobalLoading) window.hideGlobalLoading();
  }
};

// --- เรียก renderOrders ครั้งแรก ---
renderOrders();

function renderAdminDashboard() {
  // Get today string (YYYY-MM-DD)
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // Get orders and products from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const products = JSON.parse(localStorage.getItem('products') || '[]');

  // Filter today's orders
  const todaysOrders = orders.filter(o => (o.date || '').slice(0, 10) === todayStr);
  const totalSales = todaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const orderCount = todaysOrders.length;

  // Render summary
  const summaryBox = document.getElementById('summaryBox');
  if (summaryBox) {
    summaryBox.innerHTML = `
      <div style="font-size:1.2em;font-weight:700;color:#FFA726;">ยอดขายวันนี้</div>
      <div style="font-size:2em;color:#d32f2f;font-weight:800;">฿${totalSales.toLocaleString()}</div>
      <div style="margin-top:0.7em;font-size:1.1em;">จำนวนออเดอร์: <b>${orderCount}</b></div>
    `;
  }

  // Render 5 most recent orders
  const recentOrders = orders.slice(-5).reverse();
  const recentOrdersBox = document.getElementById('recentOrders');
  if (recentOrdersBox) {
    if (recentOrders.length === 0) {
      recentOrdersBox.innerHTML = '<div style="color:#888;">ยังไม่มีออเดอร์</div>';
    } else {
      recentOrdersBox.innerHTML = recentOrders.map(o => `
        <div style="padding:0.7em 0;border-bottom:1px dashed #FFA726;">
          <b>${o.customerName || '-'}</b><br>
          <span style="color:#d32f2f;">฿${(o.total||0).toLocaleString()}</span>
          <span style="color:#888;font-size:0.95em;float:right;">${o.date ? new Date(o.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
        </div>
      `).join('');
    }
  }

  // Render product stock levels
  const stockLevels = document.getElementById('stockLevels');
  if (stockLevels) {
    if (products.length === 0) {
      stockLevels.innerHTML = '<div style="color:#888;">ยังไม่มีสินค้า</div>';
    } else {
      stockLevels.innerHTML = products.map(p => `
        <div style="padding:0.5em 0;border-bottom:1px dotted #FFA726;display:flex;justify-content:space-between;align-items:center;">
          <span><b>${p.name}</b> <span style="color:#888;font-size:0.95em;">(฿${p.price})</span></span>
          <span style="font-weight:700;color:${p.stock <= 3 ? '#d32f2f' : '#FFA726'};">${p.stock}</span>
        </div>
      `).join('');
    }
  }
}

// --- แจ้งเตือนลูกค้าแบบไม่ใช้ API: แสดงข้อความ popup ให้ copy ---
function showOrderMessagePopup(idx) {
  const orders = getOrders();
  const order = orders[idx];
  const statusText = order.status === 'shipped' ? 'จัดส่งแล้ว' : order.status === 'cancelled' ? 'ยกเลิก' : 'รอดำเนินการ';
  const total = Object.values(order.products||{}).reduce((sum,p)=>sum+(p.price||0)*(p.qty||0),0);
  const prodList = Object.values(order.products||{}).filter(p=>p.qty>0).map(p=>`${p.name} x${p.qty}`).join(', ');
  const msg = `ขอบคุณที่สั่งซื้อกับ LUCKY Delivery\n\nเลขที่ออเดอร์: ${order.id||'-'}\nชื่อ: ${order.name||'-'}\nสินค้า: ${prodList}\nยอดรวม: ฿${total}\nสถานะ: ${statusText}\n\nสอบถามเพิ่มเติมติดต่อแอดมินได้เลยค่ะ`;
  // popup
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.left = '0';
  popup.style.top = '0';
  popup.style.width = '100vw';
  popup.style.height = '100vh';
  popup.style.background = 'rgba(0,0,0,0.25)';
  popup.style.zIndex = '99999';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.innerHTML = `<div style='background:#fffbe7;padding:2em 1.2em;border-radius:16px;max-width:95vw;box-shadow:0 2px 16px #FFA726;min-width:260px;'>
    <div style='font-weight:700;color:#FFA726;margin-bottom:1em;'>ข้อความแจ้งลูกค้า</div>
    <textarea id='orderMsgText' style='width:100%;height:120px;font-size:1em;border-radius:8px;border:1.2px solid #FFA726;padding:0.7em;'>${msg}</textarea>
    <div style='margin-top:1.2em;text-align:right;'>
      <button id='copyOrderMsgBtn' style='background:#FFA726;color:#fff;border:none;padding:0.7em 1.5em;border-radius:8px;font-weight:700;margin-right:0.7em;'>คัดลอก</button>
      <button id='closeOrderMsgBtn' style='background:#fff;color:#FFA726;border:1.2px solid #FFA726;padding:0.7em 1.5em;border-radius:8px;font-weight:700;'>ปิด</button>
    </div>
  </div>`;
  document.body.appendChild(popup);
  document.getElementById('copyOrderMsgBtn').onclick = function() {
    const text = document.getElementById('orderMsgText').value;
    navigator.clipboard.writeText(text);
    this.textContent = 'คัดลอกแล้ว!';
    setTimeout(()=>{ this.textContent = 'คัดลอก'; }, 1200);
  };
  document.getElementById('closeOrderMsgBtn').onclick = function() {
    document.body.removeChild(popup);
  };
}
document.getElementById('ordersAdmin').addEventListener('click', function(e) {
  if (e.target.classList.contains('notify-btn')) {
    const idx = +e.target.dataset.idx;
    showOrderMessagePopup(idx);
  }
});
