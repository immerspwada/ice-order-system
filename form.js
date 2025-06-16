// form.js - Step 2: Customer Info Form
// Clean, modular JS for customer info and sessionStorage

// --- LIFF LINE Login & Profile ---
const liffId = 'U56b89fa4ea4169863a687fe972fa3836'; // liffId จริงจากผู้ใช้
const lineLoginBtn = document.getElementById('lineLoginBtn');
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
        lineLoginBtn.style.display = 'none';
      });
    }
  });
}

lineLoginBtn.onclick = liffInitAndGetProfile;

// auto init if in LIFF
if (window.liff && window.location.search.includes('liff.state')) {
  liffInitAndGetProfile();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('customerForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const lineUserId = sessionStorage.getItem('lineUserId') || '';
    if (!name || !phone || !address) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    // Basic phone validation (Thai mobile)
    if (!/^\d{9,12}$/.test(phone)) {
      alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }
    // Save to sessionStorage
    const customerInfo = { name, phone, address, lineUserId };
    sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    window.location.href = 'summary.html';
  });
});