// public/send-receipt.js
// เรียกใช้ API backend เพื่อส่ง Flex Message ใบเสร็จให้ลูกค้า

// ฟังก์ชันดึง userId จาก LIFF (LINE Front-end Framework)
async function getLineUserId() {
  if (window.liff) {
    await window.liff.init({ liffId: window.config.liffId });
    if (!window.liff.isLoggedIn()) {
      window.liff.login();
      return null;
    }
    const profile = await window.liff.getProfile();
    return profile.userId;
  }
  return null;
}

// ฟังก์ชันสรุปข้อความแชท (CHAT_MESSAGE) จาก order
function buildChatMessage(order) {
  let msg = `ขอบคุณที่สั่งซื้อกับ LUCKY Delivery\n`;
  msg += `ชื่อ: ${order.customer.name}\n`;
  msg += `โทร: ${order.customer.phone}\n`;
  msg += `ที่อยู่: ${order.customer.address}\n`;
  msg += `----------------------\n`;
  order.items.forEach(item => {
    msg += `${item.name} x${item.qty} = ฿${item.qty * item.price}\n`;
  });
  msg += `----------------------\n`;
  msg += `รวม: ฿${order.total}`;
  if (order.discount && order.discount > 0) {
    msg += `\nส่วนลด: -฿${order.discount}`;
  }
  msg += `\nขอบคุณที่ใช้บริการ!`;
  return msg;
}

// ฟังก์ชันส่งใบเสร็จและข้อความแชทไป LINE
async function sendReceiptToLine(order) {
  try {
    const userId = await getLineUserId();
    if (!userId) {
      alert('ไม่พบ userId จาก LINE');
      return;
    }
    // ส่ง Flex Message
    const response = await fetch('https://YOUR_BACKEND_DOMAIN_OR_RENDER_URL/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order, userId })
    });
    const result = await response.json();
    // ส่งข้อความแชทสรุป (CHAT_MESSAGE)
    const chatMsg = buildChatMessage(order);
    if (window.liff) {
      await window.liff.sendMessages([
        { type: 'text', text: chatMsg }
      ]);
    }
    if (result.success) {
      alert('ส่งใบเสร็จและข้อความสรุปให้ลูกค้าทาง LINE สำเร็จ!');
    } else {
      alert('เกิดข้อผิดพลาด: ' + (result.error || 'ไม่สามารถส่งใบเสร็จได้'));
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด: ' + err.message);
  }
}

// ตัวอย่างการใช้งาน (ควรเรียกหลังสั่งซื้อสำเร็จ)
// sendReceiptToLine(orderObject);
