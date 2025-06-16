// form.js - Step 2: Customer Info Form
// Clean, modular JS for customer info and sessionStorage

// --- LIFF LINE Login & Profile ---
const liffId = '2006986568-yjrOkKqm'; // liffId จริงจากผู้ใช้
const lineProfileBox = document.getElementById('lineProfileBox');

function showProfile(profile) {
  lineProfileBox.innerHTML = `
    <img src="${profile.pictureUrl}" style="width:64px;height:64px;border-radius:50%;box-shadow:0 2px 8px #ffe082;">
    <div style="font-weight:700;margin-top:0.5em;">${profile.displayName}</div>
    <div style="font-size:0.95em;color:#888;">LINE ID: <span style="font-family:monospace;">${profile.userId}</span></div>
  `;
  lineProfileBox.style.display = '';
  document.getElementById('nameInput').value = profile.displayName;
  // เก็บ userId ใน sessionStorage ด้วย
  sessionStorage.setItem('lineUserId', profile.userId);
}

function liffInitAndGetProfile() {
  if (!window.liff) return;
  liff.init({ liffId }).then(() => {
    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      liff.getProfile().then(profile => {
        showProfile(profile);
      });
    }
  });
}

// auto init if in LIFF
if (window.liff && window.location.search.includes('liff.state')) {
  liffInitAndGetProfile();
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

// --- ตรวจสอบ session LINE ก่อนกรอกข้อมูล (ปรับ UX ไม่ redirect ทันที) ---
document.addEventListener('DOMContentLoaded', () => {
  const lineUserId = sessionStorage.getItem('lineUserId');
  if (!lineUserId) {
    showToast('กรุณาเข้าสู่ระบบด้วย LINE ก่อนกรอกข้อมูล', 2500);
    document.getElementById('lineProfileBox').style.display = 'none';
    document.getElementById('customerForm').style.display = 'none';
    return;
  }
  document.getElementById('customerForm').style.display = '';
  const form = document.getElementById('customerForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const lineUserId = sessionStorage.getItem('lineUserId') || '';
    if (!name || !phone || !address) {
      showToast('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    // Basic phone validation (Thai mobile)
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
});

// --- ดึงที่อยู่จากแผนที่ (Geolocation + Reverse Geocode) ---
const getLocationBtn = document.getElementById('getLocationBtn');
const addressInput = document.getElementById('addressInput');
const mapPreview = document.getElementById('mapPreview');

getLocationBtn.onclick = function(e) {
  e.preventDefault();
  if (!navigator.geolocation) {
    showToast('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง');
    return;
  }
  getLocationBtn.textContent = 'กำลังค้นหาตำแหน่ง...';
  getLocationBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    // แสดงแผนที่ preview
    mapPreview.innerHTML = `<img src="https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=350x180&markers=color:red%7C${lat},${lng}&key=AIzaSyA-EXAMPLE-KEY" style="width:100%;max-width:350px;border-radius:10px;box-shadow:0 2px 8px #ffe082;">`;
    // ดึงที่อยู่จาก Google Maps Geocoding API
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyA-EXAMPLE-KEY&language=th`);
      const data = await res.json();
      if (data.results && data.results[0]) {
        addressInput.value = data.results[0].formatted_address;
        showToast('ดึงที่อยู่สำเร็จ', 1800);
      } else {
        addressInput.value = '';
        showToast('ไม่พบที่อยู่', 1800);
      }
    } catch {
      addressInput.value = '';
      showToast('ไม่สามารถดึงที่อยู่ได้', 1800);
    }
    getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
    getLocationBtn.disabled = false;
  }, err => {
    showToast('ไม่สามารถระบุตำแหน่งได้');
    getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
    getLocationBtn.disabled = false;
  });
};

// --- Real-time validation เบอร์โทร/ที่อยู่ซ้ำ ---
const phoneInput = document.getElementById('phoneInput');
phoneInput.addEventListener('input', function() {
  const val = phoneInput.value.trim();
  if (!/^\d{9,12}$/.test(val)) {
    phoneInput.style.borderColor = '#d32f2f';
  } else {
    phoneInput.style.borderColor = '#FFA726';
    // ตรวจสอบซ้ำใน localStorage
    const orders = JSON.parse(localStorage.getItem('adminOrders')||'[]');
    if (orders.some(o => o.phone === val)) {
      showToast('เบอร์นี้เคยสั่งซื้อแล้ว', 1800);
      phoneInput.style.borderColor = '#FFD700';
    }
  }
});
addressInput.addEventListener('blur', function() {
  const val = addressInput.value.trim();
  if (val.length < 8) {
    addressInput.style.borderColor = '#d32f2f';
    showToast('กรุณากรอกที่อยู่ให้ครบถ้วน', 1800);
  } else {
    addressInput.style.borderColor = '#FFA726';
  }
});

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
function gotoSummary() {
  showPageLoading();
  setTimeout(()=>{ window.location.href = 'summary.html'; }, 600);
}