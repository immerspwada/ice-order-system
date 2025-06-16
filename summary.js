// summary.js: รองรับการใช้งานใน LIFF (LINE Front-end Framework)
// - ปรับ UX ให้เหมาะกับ LIFF menu (mobile-first, ปุ่มใหญ่, redirect กลับ LINE ได้)
// - ตรวจสอบ LIFF environment, ปิดหน้าต่าง/redirect LINE OA ได้
// - รองรับ slip upload, preview, และยืนยันคำสั่งซื้อ

// ตรวจสอบ LIFF
function isLiffReady() {
  return typeof liff !== 'undefined' && liff.isApiAvailable && liff.isApiAvailable('shareTargetPicker');
}

// ปุ่มปิด LIFF
function renderLiffCloseBtn() {
  if (isLiffReady()) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'ปิดหน้าต่าง';
    closeBtn.className = 'btn-main';
    closeBtn.style.background = '#e0f7fa';
    closeBtn.style.color = '#00bfff';
    closeBtn.style.marginTop = '1.5rem';
    closeBtn.onclick = () => liff.closeWindow();
    document.body.appendChild(closeBtn);
  }
}

// โหลดข้อมูล order
const summaryDiv = document.getElementById('orderSummary') || (() => {
  const d = document.createElement('div');
  d.id = 'orderSummary';
  document.body.appendChild(d);
  return d;
})();
const orderProducts = JSON.parse(sessionStorage.getItem('orderProducts') || '{}');
const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
let slipDataUrl = sessionStorage.getItem('slipDataUrl') || '';

function renderSummary() {
  let html = `<div style="text-align:center;margin-bottom:1.2rem;">
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style="vertical-align:middle;"><circle cx="28" cy="28" r="28" fill="#FFA726"/><path d="M17 29.5L25.5 38L39 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div style="font-size:1.35rem;font-weight:700;color:#FFA726;margin-top:0.5rem;letter-spacing:0.5px;">ตรวจสอบข้อมูลก่อนยืนยัน</div>
  </div>`;
  html += `<div style="background:#FFF3E0;border-radius:16px;padding:1.2rem 1.2rem 0.7rem 1.2rem;box-shadow:0 2px 8px #ffe0b2;border:1.2px solid #FFA726;max-width:420px;margin:auto;">
    <div style="font-size:1.13rem;font-weight:600;color:#FFA726;margin-bottom:0.7rem;">ข้อมูลลูกค้า</div>
    <div style="font-size:1.05rem;margin-bottom:0.7rem;line-height:1.7;">
      <b>ชื่อ:</b> ${customerInfo.name || ''}<br>
      <b>โทร:</b> ${customerInfo.phone || ''}<br>
      <b>ที่อยู่:</b> ${customerInfo.address || ''}
    </div>
    <hr style="border:none;border-top:1.5px dashed #FFA726;margin:1.1rem 0 1.2rem 0;">
    <div style="font-size:1.13rem;font-weight:600;color:#FFA726;margin-bottom:0.7rem;">รายการสินค้า</div>
    <ul style="margin:0 0 0 18px;padding:0;font-size:1.05rem;list-style:none;">
  `;
  let total = 0;
  Object.values(orderProducts).forEach(p => {
    if (p && p.qty > 0) {
      html += `<li>${p.icon ? p.icon + ' ' : ''}${p.name} <b>x${p.qty}</b> <span style='color:#d32f2f;'>฿${(p.price * p.qty).toLocaleString()}</span></li>`;
      total += p.price * p.qty;
    }
  });
  html += '</ul>';
  html += `<div style='margin-top:1.2rem;font-size:1.15rem;font-weight:700;color:#FFA726;text-align:right;'>รวมทั้งสิ้น: <span style='color:#d32f2f;'>฿${total.toLocaleString()}</span> บาท</div>`;
  html += '</div>';
  html += `<div style="background:#FFE0B2;border-radius:14px;padding:1.2rem 1rem 1.2rem 1rem;box-shadow:0 1px 4px #ffe0b2;margin:1.5rem 0 1rem 0;text-align:center;max-width:420px;margin-left:auto;margin-right:auto;">
    <label style="font-weight:600;color:#FFA726;">อัปโหลดสลิปโอนเงิน (ถ้ามี):<br>
      <input type="file" id="slipInput" accept="image/*" style="margin-top:0.5rem;">
    </label>
    <div id="slipPreview" style="margin-top:1rem;">${slipDataUrl ? `<img src="${slipDataUrl}" alt="slip" style="max-width:100%;border-radius:10px;box-shadow:0 1px 4px #ffe0b2;">` : ''}</div>
  </div>`;
  html += `<div style="text-align:center;margin-top:2.2rem;display:flex;justify-content:center;gap:1.2rem;flex-wrap:wrap;">
    <button id="editOrderBtn" class="btn-main" style="background:#FFF3E0;color:#FFA726;border:1.5px solid #FFA726;box-shadow:none;width:auto;padding:1rem 2.2rem;font-weight:700;">ย้อนกลับ</button>
    <button id="toReceiptBtn" class="btn-main" style="background:linear-gradient(90deg,#FFA726 0%,#FFE0B2 100%);color:#fff;width:auto;padding:1rem 2.2rem;font-weight:800;">ยืนยันคำสั่งซื้อ</button>
  </div>`;
  summaryDiv.innerHTML = html;
  // slip upload
  document.getElementById('slipInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      slipDataUrl = evt.target.result;
      sessionStorage.setItem('slipDataUrl', slipDataUrl);
      document.getElementById('slipPreview').innerHTML = `<img src="${slipDataUrl}" alt="slip" style="max-width:100%;border-radius:10px;box-shadow:0 1px 4px #ffe0b2;">`;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('editOrderBtn').onclick = function() {
    window.location.href = 'form.html';
  };
  document.getElementById('toReceiptBtn').onclick = function() {
    // Merge all data and go to receipt
    const orderData = { ...customerInfo, products: orderProducts, slip: slipDataUrl };
    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    // --- Save order to localStorage for admin ---
    try {
      const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      orderData.datetime = new Date().toLocaleString('th-TH', { hour12: false });
      orders.push(orderData);
      localStorage.setItem('adminOrders', JSON.stringify(orders));
    } catch(e) {}
    window.location.href = 'receipt.html';
  };
}

// LIFF init (optional, if you want to use liff.sendMessages or closeWindow)
if (typeof liff !== 'undefined') {
  liff.init({ liffId: 'YOUR_LIFF_ID' }).then(() => {
    renderSummary();
    renderLiffCloseBtn();
  });
} else {
  renderSummary();
}
