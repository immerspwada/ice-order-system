// receipt.js: load order data and slip, show receipt
const receiptDiv = document.getElementById('receipt');
const orderData = JSON.parse(sessionStorage.getItem('orderData') || '{}');
const slipDataUrl = sessionStorage.getItem('slipDataUrl') || '';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (!orderData || Object.keys(orderData).length === 0) {
  receiptDiv.innerHTML = `<div style="text-align:center;color:#d32f2f;font-size:1.2rem;margin-top:2rem;">
    ⚠️ ไม่พบข้อมูลคำสั่งซื้อ กรุณากลับไปที่หน้าฟอร์ม
    <div style="margin-top:1.2rem;">
      <button onclick="location.href='form.html'" style="background:#ffd700;padding:0.8rem 1.5rem;border-radius:10px;font-weight:600;border:none;">ย้อนกลับ</button>
    </div>
  </div>`;
} else {
  renderReceipt();
}

function renderReceipt() {
  let html = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <svg width="60" height="60" viewBox="0 0 56 56" fill="none" style="box-shadow:0 4px 16px #ffe08277;border-radius:50%;"><circle cx="28" cy="28" r="28" fill="#FFD700"/><path d="M17 29.5L25.5 38L39 22" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div style="font-size:1.7rem;font-weight:800;color:#BFA600;margin-top:0.7rem;letter-spacing:1px;">สั่งซื้อสำเร็จ!</div>
      <div style="color:#888;font-size:1.13rem;margin-top:0.3rem;">ขอบคุณที่ใช้บริการ <span style='color:#FFD700;font-weight:700;'>LUCKY Delivery</span></div>
    </div>
    <div style="background:linear-gradient(120deg,#fffde7 80%,#fff8dc 100%);border-radius:22px;padding:1.7rem 1.3rem 1.1rem 1.3rem;box-shadow:0 4px 18px #fffbe7;border:1.5px solid #fff8dc;max-width:440px;margin:auto;">
      <div style="font-size:1.18rem;font-weight:700;color:#BFA600;margin-bottom:0.8rem;letter-spacing:0.5px;text-align:left;">ข้อมูลลูกค้า</div>
      <div style="font-size:1.08rem;margin-bottom:1.1rem;line-height:1.8;text-align:left;background:#fffbe7;border-radius:10px;padding:0.8rem 1rem;box-shadow:0 1px 4px #fffbe7;">
        <b>ชื่อ:</b> ${escapeHtml(orderData.name || '')}<br>
        <b>โทร:</b> ${escapeHtml(orderData.phone || '')}<br>
        <b>ที่อยู่:</b> ${escapeHtml(orderData.address || '')}
      </div>
      <hr style="border:none;border-top:1.5px dashed #ffe082;margin:1.1rem 0 1.2rem 0;">
      <div style="font-size:1.18rem;font-weight:700;color:#BFA600;margin-bottom:0.8rem;letter-spacing:0.5px;text-align:left;">รายการสินค้า</div>
      <ul style="margin:0 0 0 18px;padding:0;font-size:1.08rem;list-style:none;">
  `;
  const productNames = {
    bottle_350: "น้ำดื่มขวด 350ml 🧴",
    bottle_600: "น้ำดื่มขวด 600ml 🧴",
    bottle_820: "น้ำดื่มขวด 820ml 🧴",
    ice_crushed: "น้ำแข็ง บด 🧊",
    ice_small: "น้ำแข็ง เล็ก 🧊",
    ice_large: "น้ำแข็ง ใหญ่ 🧊",
    gas_7kg: "แก๊ส ถัง 7 กก. 🛢️",
    gas_15kg: "แก๊ส ถัง 15 กก. 🛢️",
    gas_48kg: "แก๊ส ถัง 48 กก. 🛢️"
  };
  let total = 0;
  let hasProduct = false;
  for (let key in productNames) {
    const qty = parseInt(orderData[key], 10);
    let price = 0;
    if (key === 'bottle_350') price = 35;
    else if (key === 'bottle_600') price = 42;
    else if (key === 'bottle_820') price = 36;
    else if (key === 'ice_crushed' || key === 'ice_small' || key === 'ice_large') price = 40;
    else if (key === 'gas_7kg') price = 285;
    else if (key === 'gas_15kg') price = 490;
    else if (key === 'gas_48kg') price = 1490;
    if (!isNaN(qty) && qty > 0) {
      html += `<li style='margin-bottom:0.45em;display:flex;align-items:center;justify-content:space-between;background:#fffbe7;border-radius:8px;padding:0.5em 1em;box-shadow:0 1px 4px #fffbe7;'>
        <span>${productNames[key]}</span>
        <span style='color:#BFA600;font-weight:700;font-size:1.08em;'>× ${qty}</span>
        <span style='color:#888;font-size:0.99em;'>(฿${(qty*price).toLocaleString()})</span>
      </li>`;
      total += qty * price;
      hasProduct = true;
    }
  }
  if (!hasProduct) html += '<li style="color:#d32f2f;text-align:center;padding:0.7em 0;">- ไม่พบรายการสินค้า -</li>';
  html += '</ul>';
  html += `<div style='margin-top:1.5rem;font-size:1.22rem;font-weight:800;color:#BFA600;text-align:right;letter-spacing:0.5px;'>รวมทั้งสิ้น: <span style='color:#d32f2f;'>฿${(typeof total !== 'undefined' ? total : 0).toLocaleString()}</span> บาท</div>`;
  if (slipDataUrl) {
    html += '<div style="margin:1.5rem 0 0.5rem 0;text-align:center;"><b style="color:#43a047;font-size:1.08em;">สลิปโอนเงิน</b><br><img src="' + slipDataUrl + '" alt="slip" style="max-width:220px;max-height:220px;border-radius:16px;box-shadow:0 2px 12px #ffe082;margin-top:0.7rem;border:2.5px solid #FFD700;"></div>';
  }
  html += '</div>';
  html += `<div style="text-align:center; margin-top:2.5rem;">
    <button onclick="location.href='form.html'" style="background:linear-gradient(90deg,#FFD700 0%,#FFF8DC 100%);color:#181818;padding:1.2rem 2.5rem;border:none;border-radius:16px;font-size:1.18rem;font-weight:800;box-shadow:0 2px 16px #fffbe7;transition:background 0.2s, color 0.2s;letter-spacing:0.7px;border:2px solid #fff8dc;cursor:pointer;outline:none;position:relative;overflow:hidden;">
      สั่งซื้อใหม่
    </button>
  </div>`;
  receiptDiv.innerHTML = html;
}
