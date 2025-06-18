// backend/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const LINE_TOKEN = process.env.LINE_TOKEN;

// รับ order จาก frontend แล้วส่ง Flex Message ให้ลูกค้า
app.post('/api/send-receipt', async (req, res) => {
  try {
    const { order, userId } = req.body;
    if (!order || !userId) return res.status(400).json({ error: 'Missing order or userId' });

    // สร้าง Flex Message จากข้อมูล order
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

    // ส่ง Flex Message ไปยัง LINE
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: userId,
      messages: [flexMessage]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINE_TOKEN}`
      }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Backend server running on port', PORT));
