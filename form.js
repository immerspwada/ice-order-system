import { liffId } from './config.js'; // นำเข้า liffId จาก config.js

// form.js - Step 2: Customer Info Form
const lineProfileBox = typeof document !== 'undefined'
  ? document.getElementById('lineProfileBox')
  : null;
const customerForm = typeof document !== 'undefined'
  ? document.getElementById('customerForm')
  : null;

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

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
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
        if (!/^[0-9]{9,12}$/.test(phone)) {
          showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
          return;
        }
        const customerInfo = { name, phone, address, lineUserId };
        sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
        showToast('บันทึกข้อมูลสำเร็จ', 1200);
        setTimeout(gotoSummary, 1200);
      });
    }

    // Autofill จาก sessionStorage ถ้ามี
    const info = JSON.parse(sessionStorage.getItem('customerInfo') || 'null');
    if (info) {
      document.getElementById('nameInput').value = info.name || '';
      document.getElementById('phoneInput').value = info.phone || '';
      document.getElementById('addressInput').value = info.address || '';
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

// --- ดึงที่อยู่จากแผนที่ (Geolocation) (ไม่มี API Key จะใส่ lat/lng ให้) ---
const getLocationBtn = typeof document !== 'undefined'
  ? document.getElementById('getLocationBtn')
  : null;
const addressInput = typeof document !== 'undefined'
  ? document.getElementById('addressInput')
  : null;
const mapPreview = typeof document !== 'undefined'
  ? document.getElementById('mapPreview')
  : null;
// --- Reverse Geocoding (เทพ) ---
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`;
    const res = await fetch(url, { headers: { 'User-Agent': 'LuckyDelivery/1.0' } });
    const data = await res.json();
    return data.display_name || `${lat},${lng}`;
  } catch (e) {
    return `${lat},${lng}`;
  }
}

if (getLocationBtn) {
  getLocationBtn.onclick = async function(e) {
    e.preventDefault();
    if (!navigator.geolocation) {
      showToast('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง');
      return;
    }
    getLocationBtn.textContent = 'กำลังค้นหาตำแหน่ง...';
    getLocationBtn.disabled = true;
    showPageLoading();
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      let address = await reverseGeocode(lat, lng);
      mapPreview.innerHTML = `<div style='color:#FFA726;'>${address}</div>`;
      addressInput.value = address;
      showToast('คัดลอกที่อยู่จากแผนที่เรียบร้อย', 1800);
      getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
      getLocationBtn.disabled = false;
      hidePageLoading();
    }, err => {
      showToast('ไม่สามารถระบุตำแหน่งได้');
      getLocationBtn.textContent = '📍 ใช้ตำแหน่งจากแผนที่';
      getLocationBtn.disabled = false;
      hidePageLoading();
    });
  };
}

// --- Real-time validation เบอร์โทร/ที่อยู่ซ้ำ ---
const phoneInput = typeof document !== 'undefined'
  ? document.getElementById('phoneInput')
  : null;
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

// Utility functions for calculations and validation (shared with tests)
export function calculateTotal(items = []) {
  return items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );
}

export function validateForm({ name, phone } = {}) {
  if (!name || name.trim() === '') return false;
  const phoneStr = String(phone || '').trim();
  if (!/^[0-9]{9,12}$/.test(phoneStr)) return false;
  return true;
}
