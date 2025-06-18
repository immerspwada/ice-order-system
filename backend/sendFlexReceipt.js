// backend/sendFlexReceipt.js
require('dotenv').config();
const axios = require('axios');

const LINE_TOKEN = process.env.LINE_TOKEN;
const USER_ID = process.env.USER_ID || 'USER_ID'; // สำหรับทดสอบแบบ manual เท่านั้น

// ตัวอย่างข้อมูล order (ควรรับจาก request จริงใน production)
const order = {
  customer: {
    name: 'ตัวอย่าง ลูกค้า',
    phone: '0812345678',
    address: '123/45 ถนนตัวอย่าง แขวงตัวอย่าง เขตตัวอย่าง กรุงเทพฯ'
  },
  items: [
    { id: 'ice_small', name: 'น้ำแข็งเล็ก', qty: 2, price: 40 },
    { id: 'bottle_600', name: 'น้ำดื่มขวด 600ml', qty: 10, price: 42 }
  ],
  total: 440,
  discount: 50,
  datetime: '2025-06-17T10:00:00+07:00'
};

if (!LINE_TOKEN || !USER_ID || USER_ID === 'USER_ID') {
  console.error('กรุณาตั้งค่า LINE_TOKEN และ USER_ID ใน .env ก่อนทดสอบ');
  process.exit(1);
}

const flexMessage = {
  type: 'flex',
  altText: 'ใบเสร็จรับเงิน',
  contents: {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'ใบเสร็จรับเงิน', weight: 'bold', size: 'xl', color: '#FFA726' }
      ]
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      contents: [
        { type: 'text', text: `ลูกค้า: ${order.customer.name}`, size: 'md' },
        { type: 'text', text: `โทร: ${order.customer.phone}`, size: 'sm', color: '#888888' },
        { type: 'text', text: `ที่อยู่: ${order.customer.address}`, size: 'sm', color: '#888888', wrap: true },
        { type: 'separator' },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'md',
          contents: order.items.map(item => ({
            type: 'text',
            text: `${item.name} x${item.qty} = ฿${item.qty * item.price}`,
            size: 'sm',
            color: '#333333'
          }))
        },
        { type: 'separator' },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'md',
          contents: [
            { type: 'text', text: 'รวม', size: 'md', weight: 'bold' },
            { type: 'text', text: `฿${order.total}`, size: 'md', weight: 'bold', align: 'end', color: '#d32f2f' }
          ]
        },
        order.discount ? {
          type: 'box',
          layout: 'horizontal',
          margin: 'sm',
          contents: [
            { type: 'text', text: 'ส่วนลด', size: 'sm', color: '#388e3c' },
            { type: 'text', text: `-฿${order.discount}`, size: 'sm', align: 'end', color: '#388e3c' }
          ]
        } : null
      ].filter(Boolean)
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'ขอบคุณที่ใช้บริการ LUCKY Delivery', size: 'sm', color: '#888888', align: 'center' }
      ]
    }
  }
};

axios.post('https://api.line.me/v2/bot/message/push', {
  to: USER_ID,
  messages: [flexMessage]
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${LINE_TOKEN}`
  }
})
.then(res => console.log('ส่ง Flex Message สำเร็จ'))
.catch(err => console.error('เกิดข้อผิดพลาด', err.response?.data || err));
