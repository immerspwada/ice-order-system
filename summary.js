// summary.js: รองรับการใช้งานใน LIFF (LINE Front-end Framework)
// - ปรับ UX ให้เหมาะกับ LIFF menu (mobile-first, ปุ่มใหญ่, redirect กลับ LINE ได้)
// - ตรวจสอบ LIFF environment, ปิดหน้าต่าง/redirect LINE OA ได้
// - รองรับ slip upload, preview, และยืนยันคำสั่งซื้อ

import { liffId } from './config.js';

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

// --- Sync lineUserId จาก localStorage ถ้า sessionStorage ไม่มี ---
(function syncLineUserId() {
  if (!sessionStorage.getItem('lineUserId') && localStorage.getItem('lineUserId')) {
    sessionStorage.setItem('lineUserId', localStorage.getItem('lineUserId'));
  }
})();

// --- Sync ข้อมูลสำคัญจาก localStorage กลับเข้า sessionStorage ถ้าไม่มี ---
(function syncSessionFromLocal() {
  if (!sessionStorage.getItem('lineUserId') && localStorage.getItem('lineUserId')) {
    sessionStorage.setItem('lineUserId', localStorage.getItem('lineUserId'));
  }
  if (!sessionStorage.getItem('customerInfo') && localStorage.getItem('customerInfo')) {
    sessionStorage.setItem('customerInfo', localStorage.getItem('customerInfo'));
  }
  if (!sessionStorage.getItem('orderProducts') && localStorage.getItem('orderProducts')) {
    sessionStorage.setItem('orderProducts', localStorage.getItem('orderProducts'));
  }
})();

// --- ตรวจสอบ sessionStorage ก่อนแสดง summary ---
document.addEventListener('DOMContentLoaded', () => {
  const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
  const orderProducts = JSON.parse(sessionStorage.getItem('orderProducts') || '{}');
  const lineUserId = sessionStorage.getItem('lineUserId') || '';
  if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !lineUserId) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = 'กรุณากรอกข้อมูลใหม่ หรือเข้าสู่ระบบอีกครั้ง';
    toast.classList.add('show');
    setTimeout(()=>{
      toast.classList.remove('show');
      window.location.href = 'index.html';
    }, 1800);
    return;
  }
});

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

const lineUserId = sessionStorage.getItem('lineUserId') || '';
const lineProfileName = customerInfo.name || '';

function renderSummary() {
  let html = `<div style="text-align:center;margin-bottom:1.2rem;">
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" style="vertical-align:middle;"><circle cx="28" cy="28" r="28" fill="#FFA726"/><path d="M17 29.5L25.5 38L39 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div style="font-size:1.35rem;font-weight:700;color:#FFA726;margin-top:0.5rem;letter-spacing:0.5px;">ตรวจสอบข้อมูลก่อนยืนยัน</div>
  </div>`;
  // แสดง LINE Profile ถ้ามี
  if (lineUserId) {
    html += `<div style='background:#e0f7fa;border-radius:12px;padding:0.7em 1em;margin-bottom:1em;text-align:left;max-width:420px;margin-left:auto;margin-right:auto;'>
      <b style='color:#00bfff;'>บัญชี LINE:</b> <span style='font-weight:600;'>${lineProfileName}</span><br>
      <span style='font-size:0.97em;color:#888;'>userId: <span style='font-family:monospace;'>${lineUserId}</span></span>
    </div>`;
  }
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
  document.getElementById('toReceiptBtn').onclick = async function() {
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
    // --- ส่ง Flex Message ไป LINE ลูกค้า ---
    try {
      await fetch('https://your-backend/send-flex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customerInfo.lineUserId,
          order: orderData,
          receiptUrl: window.location.origin + '/receipt.html'
        })
      });
    } catch(e) {}
    gotoReceipt();
  };
}

// --- ปุ่มดาวน์โหลด PDF, แชร์ LINE, แสดง QR พร้อมเพย์ ---
function renderExtraActions(orderData) {
  const actionsDiv = document.createElement('div');
  actionsDiv.style.textAlign = 'center';
  actionsDiv.style.margin = '2em 0 1em 0';
  actionsDiv.innerHTML = `
    <button id='downloadPdfBtn' class='btn-main' style='width:auto;margin:0 0.7em;'>ดาวน์โหลด PDF</button>
    <button id='shareLineBtn' class='btn-main' style='width:auto;margin:0 0.7em;background:#00c300;color:#fff;'>แชร์ผ่าน LINE</button>
    <div style='margin-top:1.2em;'>
      <img src='https://promptpay.io/0888888888/100.png' alt='QR พร้อมเพย์' style='width:160px;border-radius:12px;box-shadow:0 2px 8px #ffe082;'>
      <div style='font-size:0.98em;color:#888;margin-top:0.5em;'>สแกนเพื่อชำระเงิน</div>
    </div>
  `;
  document.body.appendChild(actionsDiv);
  document.getElementById('downloadPdfBtn').onclick = function() {
    window.print();
  };
  document.getElementById('shareLineBtn').onclick = function() {
    const msg = `สรุปออเดอร์ LUCKY Delivery\nชื่อ: ${orderData.name}\nยอดรวม: ฿${Object.values(orderData.products||{}).reduce((sum,p)=>sum+(p.price||0)*(p.qty||0),0)}`;
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(msg)}`);
  };
}

// --- Loading/animation ขณะเปลี่ยนหน้า ---
function showPageLoading() {
  let loading = document.getElementById('pageLoading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'pageLoading';
    loading.style.position = 'fixed';
    loading.style.left = '0';
    loading.style.top = '0';
    loading.style.width = '100vw';
    loading.style.height = '100vh';
    loading.style.background = 'rgba(255,255,255,0.7)';
    loading.style.display = 'flex';
    loading.style.alignItems = 'center';
    loading.style.justifyContent = 'center';
    loading.innerHTML = '<div style="border:6px solid #FFA726;border-top:6px solid #fff;border-radius:50%;width:54px;height:54px;animation:spin 1s linear infinite;"></div>';
    document.body.appendChild(loading);
  }
  loading.style.display = 'flex';
}
function hidePageLoading() {
  const loading = document.getElementById('pageLoading');
  if (loading) loading.style.display = 'none';
}
// ใช้ loading ตอนเปลี่ยนหน้า
function gotoReceipt() {
  showPageLoading();
  setTimeout(()=>{ window.location.href = 'receipt.html'; }, 600);
}

// ดึงชื่อจาก LINE LIFF profile แล้วแสดงชื่อผู้ใช้ที่ล็อกอินใน element ที่มี id="username"
async function displayUserNameFromLINE() {
  if (typeof liff === 'undefined') return;
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();
    const el = document.getElementById('username');
    if (el) el.textContent = profile.displayName;
  } catch (e) {
    // กรณี error ไม่ต้องแสดงอะไร
  }
}

// --- LIFF init/profile แบบเดียวกันสำหรับ github.io ---
async function liffInitAndProfile() {
  if (typeof liff === 'undefined') return false;
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return false;
    }
    const profile = await liff.getProfile();
    localStorage.setItem("displayName", profile.displayName);
    localStorage.setItem("pictureUrl", profile.pictureUrl);
    localStorage.setItem("lineUserId", profile.userId);
    return profile;
  } catch (e) {
    return false;
  }
}

// เรียกใช้ liffInitAndProfile ก่อน logic อื่น ๆ
(async function() {
  const ok = await liffInitAndProfile();
  if (!ok) return;
  renderSummary();
  renderLiffCloseBtn();
  displayUserNameFromLINE();
})();

const name = localStorage.getItem("displayName");
if (!name) {
  liff.login({ redirectUri: window.location.href });
}

//# sourceMappingURL=summary.js.map
