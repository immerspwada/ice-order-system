// form.js - Step 2: Customer Info Form
// Clean, modular JS for customer info and sessionStorage

const liffId = '2006986568-yjrOkKqm';
const lineProfileBox = document.getElementById('lineProfileBox');
const customerForm = document.getElementById('customerForm');
let isLoggedIn = false;

function showProfile(profile) {
  lineProfileBox.innerHTML = `
    <img src="${profile.pictureUrl}" style="width:64px;height:64px;border-radius:50%;box-shadow:0 2px 8px #ffe082;">
    <div style="font-weight:700;margin-top:0.5em;">${profile.displayName}</div>
    <div style="font-size:0.95em;color:#888;">LINE ID: <span style="font-family:monospace;">${profile.userId}</span></div>
  `;
  lineProfileBox.style.display = '';
  document.getElementById('nameInput').value = profile.displayName;
  sessionStorage.setItem('lineUserId', profile.userId);
}

function renderLoginState() {
  if (isLoggedIn) {
    // แสดงฟอร์ม
    if (customerForm) customerForm.style.display = '';
    if (lineProfileBox) lineProfileBox.style.display = '';
    const msg = document.getElementById('loginMsg');
    if (msg) msg.style.display = 'none';
  } else {
    // ซ่อนฟอร์ม แสดงปุ่ม login + ข้อความ
    if (customerForm) customerForm.style.display = 'none';
    if (lineProfileBox) lineProfileBox.style.display = 'none';
    let msg = document.getElementById('loginMsg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'loginMsg';
      msg.style = 'text-align:center;margin:2em 0;color:#d32f2f;font-weight:600;';
      document.body.appendChild(msg);
    }
    msg.innerHTML = `
      <div style='margin-bottom:1.2em;'>กรุณาเข้าสู่ระบบด้วย LINE ก่อนกรอกข้อมูล</div>
      <button id='lineLoginBtn' class='btn-main' style='width:auto;'>เข้าสู่ระบบด้วย LINE</button>
    `;
    msg.style.display = '';
    document.getElementById('lineLoginBtn').onclick = () => {
      if (window.liff) {
        liff.init({ liffId }).then(() => {
          liff.login();
        });
      }
    };
  }
}

function liffInitAndCheckLogin() {
  if (!window.liff) {
    isLoggedIn = false;
    renderLoginState();
    return;
  }
  liff.init({ liffId }).then(() => {
    if (!liff.isLoggedIn()) {
      isLoggedIn = false;
      renderLoginState();
    } else {
      isLoggedIn = true;
      liff.getProfile().then(profile => {
        showProfile(profile);
        renderLoginState();
        // Autofill จาก sessionStorage ถ้ามี
        const info = JSON.parse(sessionStorage.getItem('customerInfo')||'null');
        if (info) {
          document.getElementById('nameInput').value = info.name||'';
          document.getElementById('phoneInput').value = info.phone||'';
          document.getElementById('addressInput').value = info.address||'';
        }
      });
    }
  });
}

// --- Toast Notification ---
function showToast(msg, ms=2200) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), ms);
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
function gotoSummary() {
  showPageLoading();
  setTimeout(()=>{ window.location.href = 'summary.html'; }, 600);
}

// --- ตรวจสอบ session LINE และบังคับ login อัตโนมัติ ---
document.addEventListener('DOMContentLoaded', () => {
  liffInitAndCheckLogin();
  // --- ฟอร์ม submit ---
  if (customerForm) {
    customerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = customerForm.name.value.trim();
      const phone = customerForm.phone.value.trim();
      const address = customerForm.address.value.trim();
      const lineUserId = sessionStorage.getItem('lineUserId') || '';
      if (!name || !phone || !address) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
      }
      if (!/^\d{9,12}$/.test(phone)) {
        showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
        return;
      }
      // Save to sessionStorage
      const customerInfo = { name, phone, address, lineUserId };
      sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
      showToast('บันทึกข้อมูลสำเร็จ', 1200);
      setTimeout(gotoSummary, 1200);
    });
  }
});

// --- ดึงที่อยู่จากแผนที่ (Geolocation) (ไม่มี API Key จะใส่ lat/lng ให้) ---
const getLocationBtn = document.getElementById('getLocationBtn');
const addressInput = document.getElementById('addressInput');
const mapPreview = document.getElementById('mapPreview');
if (getLocationBtn) {
  getLocationBtn.onclick = function(e) {
    e.preventDefault();
    if (!navigator.geolocation) {
      showToast('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง');
      return;
    }
    getLocationBtn.textContent = 'กำลังค้นหาตำแหน่ง...';
    getLocationBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      mapPreview.innerHTML = `<div style='color:#FFA726;'>พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}</div>`;
      addressInput.value = `พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      showToast('คัดลอกพิกัดเรียบร้อย', 1800);
      getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
      getLocationBtn.disabled = false;
    }, err => {
      showToast('ไม่สามารถระบุตำแหน่งได้');
      getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
      getLocationBtn.disabled = false;
    });
  };
}

// --- Real-time validation เบอร์โทร/ที่อยู่ซ้ำ ---
const phoneInput = document.getElementById('phoneInput');
if (phoneInput) {
  phoneInput.addEventListener('input', function() {
    const val = phoneInput.value.trim();
    if (!/^\d{9,12}$/.test(val)) {
      phoneInput.style.borderColor = '#d32f2f';
    } else {
      phoneInput.style.borderColor = '#FFA726';
      const orders = JSON.parse(localStorage.getItem('adminOrders')||'[]');
      if (orders.some(o => o.phone === val)) {
        showToast('เบอร์นี้เคยสั่งซื้อแล้ว', 1800);
        phoneInput.style.borderColor = '#FFD700';
      }
    }
  });
}
if (addressInput) {
  addressInput.addEventListener('blur', function() {
    const val = addressInput.value.trim();
    if (val.length < 8) {
      addressInput.style.borderColor = '#d32f2f';
      showToast('กรุณากรอกที่อยู่ให้ครบถ้วน', 1800);
    } else {
      addressInput.style.borderColor = '#FFA726';
    }
  });
}