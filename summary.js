// summary.js: รองรับการใช้งานใน LIFF (LINE Front-end Framework)
// - แสดงข้อมูลสรุปคำสั่งซื้อหลังผ่าน LIFF และ session check จาก summary.html

function saveUserProfile(profile) {
  if (!profile || !profile.userId) return;
  const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
  userProfiles[profile.userId] = {
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    userId: profile.userId
  };
  localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
}

function getUserProfile(userId) {
  const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
  return userProfiles[userId] || null;
}

function renderSummary() {
  const summaryDiv = document.getElementById('orderSummary') || (() => {
    const d = document.createElement('div');
    d.id = 'orderSummary';
    document.body.appendChild(d);
    return d;
  })();
  let customerInfo, orderProducts, slipDataUrl, lineUserId, lineProfileName;
  try {
    customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
    orderProducts = JSON.parse(sessionStorage.getItem('orderProducts') || '{}');
    slipDataUrl = sessionStorage.getItem('slipDataUrl') || '';
    lineUserId = sessionStorage.getItem('lineUserId') || '';
    lineProfileName = customerInfo.name || '';
  } catch (e) {
    summaryDiv.innerHTML = `<div style='color:#d32f2f;text-align:center;font-size:1.15em;margin:2em 0;'>ข้อมูล session ผิดพลาด กรุณากรอกข้อมูลใหม่<br><button onclick=\"window.location.href='form.html'\" style=\"margin-top:1.5em;background:#FFA726;color:#fff;padding:0.8em 2em;border:none;border-radius:8px;font-size:1em;font-weight:600;cursor:pointer;\">กลับไปกรอกข้อมูล</button></div>`;
    return;
  }
  // --- เพิ่มการแสดงโปรไฟล์ผู้ใช้ ---
  let userProfile = getUserProfile(lineUserId);
  let html = `<div style=\"text-align:center;margin-bottom:1.2rem;\">`;
  if (userProfile && userProfile.pictureUrl) {
    html += `<img src='${userProfile.pictureUrl}' alt='profile' style='width:64px;height:64px;border-radius:50%;box-shadow:0 2px 8px #ffe082;margin-bottom:0.5em;'>`;
  }
  html += `<svg width=\"48\" height=\"48\" viewBox=\"0 0 56 56\" fill=\"none\" style=\"vertical-align:middle;\"><circle cx=\"28\" cy=\"28\" r=\"28\" fill=\"#FFA726\"/><path d=\"M17 29.5L25.5 38L39 22\" stroke=\"#fff\" stroke-width=\"3.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>\n    <div style=\"font-size:1.35rem;font-weight:700;color:#FFA726;margin-top:0.5rem;letter-spacing:0.5px;\">ตรวจสอบข้อมูลก่อนยืนยัน</div>\n  </div>`;
  if (lineUserId) {
    html += `<div style='background:#e0f7fa;border-radius:12px;padding:0.7em 1em;margin-bottom:1em;text-align:left;max-width:420px;margin-left:auto;margin-right:auto;'>`;
    if (userProfile && userProfile.displayName) {
      html += `<b style='color:#00bfff;'>บัญชี LINE:</b> <span style='font-weight:600;'>${userProfile.displayName}</span><br>`;
    } else {
      html += `<b style='color:#00bfff;'>บัญชี LINE:</b> <span style='font-weight:600;'>${lineProfileName}</span><br>`;
    }
    html += `<span style='font-size:0.97em;color:#888;'>userId: <span style='font-family:monospace;'>${lineUserId}</span></span></div>`;
  }
  html += `<div style=\"background:#FFF3E0;border-radius:16px;padding:1.2rem 1.2rem 0.7rem 1.2rem;box-shadow:0 2px 8px #ffe0b2;border:1.2px solid #FFA726;max-width:420px;margin:auto;\">
    <div style=\"font-size:1.13rem;font-weight:600;color:#FFA726;margin-bottom:0.7rem;\">ข้อมูลลูกค้า</div>
    <div style=\"font-size:1.05rem;margin-bottom:0.7rem;line-height:1.7;\">
      <b>ชื่อ:</b> ${customerInfo.name || ''}<br>
      <b>โทร:</b> ${customerInfo.phone || ''}<br>
      <b>ที่อยู่:</b> ${customerInfo.address || ''}
    </div>
    <hr style=\"border:none;border-top:1.5px dashed #FFA726;margin:1.1rem 0 1.2rem 0;\">
    <div style=\"font-size:1.13rem;font-weight:600;color:#FFA726;margin-bottom:0.7rem;\">รายการสินค้า</div>
    <ul style=\"margin:0 0 0 18px;padding:0;font-size:1.05rem;list-style:none;\">`;
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
  html += `<div style=\"background:#FFE0B2;border-radius:14px;padding:1.2rem 1rem 1.2rem 1rem;box-shadow:0 1px 4px #ffe0b2;margin:1.5rem 0 1rem 0;text-align:center;max-width:420px;margin-left:auto;margin-right:auto;\">\n    <label style=\"font-weight:600;color:#FFA726;\">อัปโหลดสลิปโอนเงิน (ถ้ามี):<br>
      <input type=\"file\" id=\"slipInput\" accept=\"image/*\" style=\"margin-top:0.5rem;\">
    </label>
    <div id=\"slipPreview\" style=\"margin-top:1rem;\">${slipDataUrl ? `<img src="${slipDataUrl}" alt="slip" style="max-width:100%;border-radius:10px;box-shadow:0 1px 4px #ffe0b2;">` : ''}</div>
  </div>`;
  html += `<div style=\"text-align:center;margin-top:2.2rem;display:flex;justify-content:center;gap:1.2rem;flex-wrap:wrap;\">\n    <button id=\"editOrderBtn\" class=\"btn-main\" style=\"background:#FFF3E0;color:#FFA726;border:1.5px solid #FFA726;box-shadow:none;width:auto;padding:1rem 2.2rem;font-weight:700;\">ย้อนกลับ</button>\n    <button id=\"toReceiptBtn\" class=\"btn-main\" style=\"background:linear-gradient(90deg,#FFA726 0%,#FFE0B2 100%);color:#fff;width:auto;padding:1rem 2.2rem;font-weight:800;\">ยืนยันคำสั่งซื้อ</button>\n  </div>`;
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
    window.location.href = 'receipt.html';
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // --- ดึงโปรไฟล์จาก LIFF (ถ้ามี) แล้วบันทึก ---
  if (window.liff && typeof liff.getProfile === 'function') {
    liff.getProfile().then(profile => {
      saveUserProfile(profile);
      renderSummary();
    }).catch(() => renderSummary());
  } else {
    renderSummary();
  }
});

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LuckyDelivery/1.0' } });
  const data = await res.json();
  return data.display_name || '';
}

// ตัวอย่างการใช้งาน
reverseGeocode(6.02458, 101.96366).then(address => {
  console.log(address); // จะได้ที่อยู่ภาษาไทย
});
