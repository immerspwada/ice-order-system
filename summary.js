// summary.js: รองรับการใช้งานใน LIFF (LINE Front-end Framework)
// - แสดงข้อมูลสรุปคำสั่งซื้อหลังผ่าน LIFF และ session check จาก summary.html

function saveUserProfile(profile) {
  if (!profile || !profile.userId) return;
  const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
  userProfiles[profile.userId] = {
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    userId: profile.userId,
    email: profile.email || '', // เพิ่มการเก็บอีเมล
    statusMessage: profile.statusMessage || '' // เพิ่มข้อมูล status message
  };
  localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
}

function getUserProfile(userId) {
  const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
  return userProfiles[userId] || null;
}

function renderStepper(currentStep = 2) {
  // 1: กรอกข้อมูล, 2: สรุป, 3: เสร็จสิ้น
  const steps = [
    { label: 'กรอกข้อมูล', icon: '<svg width="22" height="22" fill="none"><circle cx="11" cy="11" r="10" fill="#fff3e0" stroke="#FFA726" stroke-width="2"/><path d="M7 11.5l2.5 2.5L15 8" stroke="#FFA726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { label: 'สรุป', icon: '<svg width="22" height="22" fill="none"><circle cx="11" cy="11" r="10" fill="#fff3e0" stroke="#FFA726" stroke-width="2"/><path d="M7 11.5l2.5 2.5L15 8" stroke="#FFA726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { label: 'เสร็จสิ้น', icon: '<svg width="22" height="22" fill="none"><circle cx="11" cy="11" r="10" fill="#fff3e0" stroke="#FFA726" stroke-width="2"/><path d="M7 11.5l2.5 2.5L15 8" stroke="#FFA726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
  ];
  const stepper = document.createElement('nav');
  stepper.className = 'order-stepper';
  stepper.setAttribute('aria-label', 'Order Progress');
  let html = `<ol class="stepper-list" role="list">`;
  steps.forEach((step, idx) => {
    const stepNum = idx + 1;
    const isCompleted = stepNum < currentStep;
    const isCurrent = stepNum === currentStep;
    html += `<li class="stepper-item${isCompleted ? ' completed' : ''}${isCurrent ? ' current' : ''}" 
      role="listitem" aria-current="${isCurrent ? 'step' : 'false'}" aria-label="${step.label}">
      <span class="stepper-circle" aria-hidden="true">
        ${isCompleted
          ? `<svg width="22" height="22" fill="none"><circle cx="11" cy="11" r="10" fill="url(#grad${stepNum})" stroke="#FFA726" stroke-width="2"/><path d="M7 11.5l2.5 2.5L15 8" stroke="#FFA726" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          : isCurrent
            ? `<span class="stepper-current-icon">${step.icon}</span>`
            : `<span class="stepper-num">${stepNum}</span>`
        }
      </span>
      <span class="stepper-label">${step.label}</span>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="grad${stepNum}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFA726"/>
            <stop offset="100%" stop-color="#FF7043"/>
          </linearGradient>
        </defs>
      </svg>
    </li>`;
    if (stepNum < steps.length) {
      html += `<li class="stepper-line" aria-hidden="true"><span class="stepper-line-inner"></span></li>`;
    }
  });
  html += `</ol>`;
  stepper.innerHTML = html;
  return stepper;
}

// เพิ่มฟังก์ชัน logger
function log(type, message, data = null) {
  console.log(`[${type}] ${message}`, data || '');
  // สามารถส่ง log ไปเก็บที่ server ได้
}

// เพิ่มฟังก์ชันตรวจสอบข้อมูล
function validateSessionData(data) {
  const required = ['name', 'phone', 'address'];
  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`ข้อมูลไม่ครบ: ${missing.join(', ')}`);
  }
}

// เพิ่มฟังก์ชันแสดง Toast notification
function showToast(message, duration = 3000) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ปรับปรุงฟังก์ชัน validateOrderProducts
function validateOrderProducts(products) {
  if (!products || typeof products !== 'object') {
    throw new Error('ไม่พบข้อมูลสินค้า');
  }
  const hasValidProduct = Object.values(products).some(p => p && p.qty > 0);
  if (!hasValidProduct) {
    throw new Error('ไม่พบรายการสินค้า');
  }

  // เพิ่มการตรวจสอบขั้นต่ำของแต่ละประเภท
  let totalWater = 0;
  let totalIce = 0;
  Object.entries(products).forEach(([id, p]) => {
    if (id.startsWith('bottle_')) totalWater += p.qty;
    if (id.startsWith('ice_')) totalIce += p.qty;
    // เพิ่มการตรวจสอบว่า p เป็น object และมี qty
  });

  if (totalWater > 0 && totalWater < config.minOrder.water) {
    throw new Error(`น้ำดื่มต้องสั่งขั้นต่ำ ${config.minOrder.water} แพ็ค`);
  }
  if (totalIce > 0 && totalIce < config.minOrder.ice) {
    throw new Error(`น้ำแข็งต้องสั่งขั้นต่ำ ${config.minOrder.ice} ถุง`);
  }
}

// เพิ่มฟังก์ชันตรวจสอบคูปองส่วนลด
function validateCoupon(couponCode, total) {
  const coupons = config.coupons;
  const coupon = coupons.find(c => c.code === couponCode);
  if (!coupon) {
    throw new Error('คูปองส่วนลดไม่ถูกต้อง');
  }
  if (total < coupon.minPurchase) {
    throw new Error(`ต้องมียอดสั่งซื้อขั้นต่ำ ${coupon.minPurchase} บาท`);
  }
  // Check if coupon is expired
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    throw new Error('คูปองส่วนลดหมดอายุแล้ว');
  }
  return coupon;
}

// ปรับปรุงฟังก์ชัน renderSummary
function renderSummary() {
  log('INFO', 'เริ่มแสดงข้อมูลสรุป');
  const summaryDiv = document.getElementById('orderSummary');
  if (!summaryDiv) {
    log('ERROR', 'ไม่พบ element สำหรับแสดงข้อมูล');
    return;
  }

  try {
    // ดึงและตรวจสอบข้อมูล session
    const customerInfo = JSON.parse(sessionStorage.getItem('customerInfo') || '{}');
    const orderProducts = JSON.parse(sessionStorage.getItem('orderProducts') || '{}');
    
    validateSessionData(customerInfo);
    
    // เพิ่มการตรวจสอบว่า orderProducts ว่างหรือไม่
    if (!orderProducts || Object.keys(orderProducts).length === 0) {
      throw new Error('ไม่พบรายการสินค้า');
    }

    validateOrderProducts(orderProducts);
    
    log('INFO', 'ข้อมูลลูกค้า:', customerInfo);
    log('INFO', 'ข้อมูลสินค้า:', orderProducts);

    // --- แทรก stepper ด้านบน ---
    summaryDiv.innerHTML = '';
    summaryDiv.appendChild(renderStepper(2));
    let slipDataUrl, lineUserId, lineProfileName;
    try {
      slipDataUrl = sessionStorage.getItem('slipDataUrl') || '';
      lineUserId = sessionStorage.getItem('lineUserId') || '';
      lineProfileName = customerInfo.name || '';
      // ตรวจสอบข้อมูล session ที่จำเป็น
      if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || !orderProducts || Object.keys(orderProducts).length === 0) {
        throw new Error('ข้อมูล session ไม่ครบ');
      }
    } catch (e) {
      summaryDiv.innerHTML = `<div style='color:#d32f2f;text-align:center;font-size:1.15em;margin:2em 0;'>ข้อมูล session ผิดพลาดหรือไม่ครบ กรุณากรอกข้อมูลใหม่<br><button onclick="window.location.href='form.html'" style="margin-top:1.5em;background:#FFA726;color:#fff;padding:0.8em 2em;border:none;border-radius:8px;font-size:1em;font-weight:600;cursor:pointer;">กลับไปกรอกข้อมูล</button></div>`;
      return;
    }
    // --- เพิ่มการแสดงโปรไฟล์ผู้ใช้ ---
    let userProfile = getUserProfile(lineUserId);
    let html = `<div style="text-align:center;margin-bottom:1.2rem;">`;
    if (userProfile && userProfile.pictureUrl) {
      html += `<img src='${userProfile.pictureUrl}' alt='profile' style='width:64px;height:64px;border-radius:50%;box-shadow:0 2px 8px #ffe082;margin-bottom:0.5em;'>`;
    }
    html += `<svg width="48" height="48" viewBox="0 0 56 56" fill="none" style="vertical-align:middle;"><circle cx="28" cy="28" r="28" fill="#FFA726"/><path d="M17 29.5L25.5 38L39 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <div style="font-size:1.35rem;font-weight:700;color:#FFA726;margin-top:0.5rem;letter-spacing:0.5px;">ตรวจสอบข้อมูลก่อนยืนยัน</div>
  </div>`;
  if (lineUserId) {
    html += `<div style='background:#e0f7fa;border-radius:12px;padding:0.7em 1em;margin-bottom:1em;text-align:left;max-width:420px;margin-left:auto;margin-right:auto;'>`;
    if (userProfile && userProfile.displayName) {
      html += `<b style='color:#00bfff;'>บัญชี LINE:</b> <span style='font-weight:600;'>${userProfile.displayName}</span><br>`;
      if (userProfile.email) {
        html += `<b style='color:#00bfff;'>อีเมล:</b> <span style='font-weight:500;'>${userProfile.email}</span><br>`;
      }
      if (userProfile.statusMessage) {
        html += `<span style='color:#666;font-size:0.95em;'>"${userProfile.statusMessage}"</span><br>`;
      }
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

    const shipping = calculateShipping(total, customerInfo.address);
    let discount = 0;
    try {
      const couponCode = prompt('กรุณากรอกรหัสคูปองส่วนลด (ถ้ามี):', '');
      if (couponCode) {
        const coupon = validateCoupon(couponCode, total);
        discount = coupon.discount;
        total -= discount;
      }
    } catch (e) {
      showToast(e.message, 4000);
    }

    html += `<div style='margin-top:1.2rem;font-size:1.15rem;font-weight:700;color:#FFA726;text-align:right;'>
      ยอดรวม: <span style='color:#d32f2f;'>฿${total.toLocaleString()}</span> บาท
      ${discount > 0 ? `<span style='color:#43a047;'> (ส่วนลด ${discount} บาท)</span>` : ''}
    </div>`;
    html += '</div>';
    html += `<div style=\"background:#FFE0B2;border-radius:14px;padding:1.2rem 1rem 1.2rem 1rem;box-shadow:0 1px 4px #ffe0b2;margin:1.5rem 0 1rem 0;text-align:center;max-width:420px;margin-left:auto;margin-right:auto;\">\n    <label style=\"font-weight:600;color:#FFA726;\">อัปโหลดสลิปโอนเงิน (ถ้ามี):<br>
        <input type=\"file\" id=\"slipInput\" accept=\"image/*\" style=\"margin-top:0.5rem;\">
      </label>
      <div id=\"slipPreview\" style=\"margin-top:1rem;\">${slipDataUrl ? `<img src="${slipDataUrl}" alt="slip" style="max-width:100%;border-radius:10px;box-shadow:0 1px 4px #ffe0b2;">` : ''}</div>
    </div>`;
    html += `<div style="text-align:center;margin-top:2.2rem;display:flex;justify-content:center;gap:1.2rem;flex-wrap:wrap;">
      <button id="editOrderBtn" class="btn-main btn-gradient" style="width:auto;padding:1rem 2.2rem;font-weight:700;">
        ย้อนกลับ
      </button>
      <button id="toReceiptBtn" class="btn-main btn-gradient" style="width:auto;padding:1rem 2.2rem;font-weight:800;position:relative;">
        <span class="btn-label">ยืนยันคำสั่งซื้อ</span>
        <span class="btn-spinner" style="display:none;position:absolute;left:16px;top:50%;transform:translateY(-50%);">
          <svg width="22" height="22" viewBox="0 0 44 44" style="vertical-align:middle;" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
            <g fill="none" fill-rule="evenodd" stroke-width="4">
              <circle cx="22" cy="22" r="18" stroke-opacity=".3"/>
              <path d="M40 22c0-9.94-8.06-18-18-18">
                <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.8s" repeatCount="indefinite"/>
              </path>
            </g>
          </svg>
        </span>
      </button>
    </div>`;
    summaryDiv.insertAdjacentHTML('beforeend', html);
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
      const btn = this;
      const label = btn.querySelector('.btn-label');
      const spinner = btn.querySelector('.btn-spinner');
      btn.disabled = true;
      btn.classList.add('btn-disabled');
      if (label && spinner) {
        label.style.visibility = 'hidden';
        spinner.style.display = 'inline-block';
      }
      // Merge all data and go to receipt
      const orderData = { ...customerInfo, products: orderProducts, slip: slipDataUrl, total: total + shipping - discount, shipping: shipping, discount: discount };
      sessionStorage.setItem('orderData', JSON.stringify(orderData));
      sessionStorage.setItem('PRODUCTS', JSON.stringify(PRODUCTS));
      try {
        const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        orderData.datetime = new Date().toLocaleString('th-TH', { hour12: false });
        orders.push(orderData);
        localStorage.setItem('adminOrders', JSON.stringify(orders));
      } catch(e) {}
      // Send order summary to LINE chat
      sendOrderSummaryToChat(orderProducts, total + shipping - discount);
      setTimeout(() => {
        window.location.href = 'receipt.html';
      }, 600);
    };
  } catch (error) {
    log('ERROR', 'เกิดข้อผิดพลาด:', error);
    summaryDiv.innerHTML = `
      <div style='color:#d32f2f;text-align:center;font-size:1.15em;margin:2em 0;'>
        ${error.message}<br>
        <button onclick="window.location.href='form.html'" 
          style="margin-top:1.5em;background:#FFA726;color:#fff;
          padding:0.8em 2em;border:none;border-radius:8px;
          font-size:1em;font-weight:600;cursor:pointer;">
          กลับไปกรอกข้อมูล
        </button>
      </div>`;
    return;
  }
}

// ฟังก์ชันดาวน์โหลดใบเสร็จ PDF ด้วย html2pdf.js
function downloadReceipt() {
  const element = document.getElementById('orderSummary');
  if (!element) return;
  const opt = {
    margin:       10,
    filename:     'receipt.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// LIFF initialization, auto-login, and client check
document.addEventListener('DOMContentLoaded', async () => {
  log('INFO', 'เริ่มต้นแอปพลิเคชัน');
  
  try {
    const initialized = await initializeLiff();
    if (!initialized) {
      log('ERROR', 'LIFF initialization failed');
      return;
    }
    renderSummary();
  } catch (error) {
    log('ERROR', 'เกิดข้อผิดพลาดในการเริ่มต้น LIFF:', error);
    renderSummary();
  }
});

async function initializeLiff() {
  try {
    log('INFO', 'Initializing LIFF');
    
    if (!window.liff) {
      throw new Error('LIFF SDK not loaded');
    }

    await liff.init({ liffId: config.liffId, withLoginOnExternalBrowser: true, scope: ["profile", "email"] });
    
    if (!liff.isLoggedIn()) {
      log('INFO', 'User not logged in');
      liff.login({ redirectUri: window.location.href });
      return false;
    }

    if (!liff.isInClient()) {
      log('WARN', 'Not in LINE client');
      showToast('กรุณาเปิดผ่านแอป LINE เท่านั้น');
      return false;
    }

    const profile = await liff.getProfile();
    log('INFO', 'Got user profile', profile);
    
    saveUserProfile(profile);
    sessionStorage.setItem('lineUserId', profile.userId);
    sessionStorage.setItem('lineEmail', profile.email || '');
    
    return true;

  } catch (error) {
    log('ERROR', 'LIFF initialization failed', error);
    showToast('เกิดข้อผิดพลาดในการเริ่มต้น LIFF');
    return false;
  }
}

// เพิ่มฟังก์ชันสำหรับดึงที่อยู่จาก lat/lng
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`;
    const res = await fetch(url, { headers: { 'User-Agent': 'LuckyDelivery/1.0' } });
     if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.display_name || '';
  } catch (error) {
    log('ERROR', 'Reverse geocoding failed', error);
    showToast('เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่');
    return '';
  }
}

// ปรับปรุง validation
function validateOrder(data) {
  const required = ['name', 'phone', 'address', 'products'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`ข้อมูลไม่ครบ: ${missing.join(', ')}`);
  }

  // Validate product quantities
  Object.entries(data.products).forEach(([id, product]) => {
    if (id.startsWith('bottle_') && product.qty < config.minOrder.water) {
      throw new Error(`น้ำดื่มต้องสั่งขั้นต่ำ ${config.minOrder.water} แพ็ค`);
    }
  });
}

// เพิ่มฟังก์ชันคำนวณค่าส่ง
function calculateShipping(total, address) {
  let shipping = 0;
  if (total < config.freeShippingThreshold) {
    shipping = config.shippingCost;
  }
  // คำนวณระยะทางและเพิ่มค่าส่งตามโซน
  // ...
  return shipping;
}

// ปรับปรุงการแสดงผลรวม
function renderOrderSummary(orderProducts, shipping) {
  let html = '';
  let subtotal = 0;
  // ...existing rendering code...
  
  html += `
    <div class="summary-total">
      <div class="summary-row">
        <span>ยอดรวมสินค้า:</span>
        <span>฿${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>ค่าจัดส่ง:</span>
        <span>฿${shipping.toLocaleString()}</span>
      </div>
      <div class="summary-row total">
        <span>รวมทั้งสิ้น:</span>
        <span>฿${(subtotal + shipping).toLocaleString()}</span>
      </div>
    </div>
  `;
  return html;
}

// ส่งข้อความสรุปคำสั่งซื้อไปยังแชทของลูกค้า
function sendOrderSummaryToChat(orderProducts, total) {
  if (window.liff && liff.isApiAvailable && liff.isApiAvailable('shareTargetPicker')) {
    const items = Object.values(orderProducts)
      .filter(p => p && p.qty > 0)
      .map(p => `${p.icon ? p.icon + ' ' : ''}${p.name} x${p.qty} = ฿${(p.price * p.qty).toLocaleString()}`)
      .join('\n');
    const msg = `ขอบคุณที่สั่งซื้อกับ LUCKY Delivery\n\nรายการที่สั่ง:\n${items}\n\nรวมทั้งสิ้น: ฿${total.toLocaleString()}`;
    liff.sendMessages([
      { type: 'text', text: msg }
    ]).catch(() => {});
  }
}
