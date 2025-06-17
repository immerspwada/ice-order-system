// config.js - Shared configuration for LIFF and other constants
export const config = {
  liffId: '2006986568-yjrOkKqm',
  debug: true, // เปิด/ปิด logging
  minOrder: {
    water: 10, // ขั้นต่ำน้ำดื่ม
    ice: 1,    // ขั้นต่ำน้ำแข็ง
    gas: 1     // ขั้นต่ำแก๊ส
  },
  api: {
    timeout: 10000,
    baseUrl: 'https://your-api.com'
  },
  shippingCost: 50, // ค่าส่ง
  freeShippingThreshold: 1000, // ยอดซื้อขั้นต่ำส่งฟรี
  coupons: [
    {
      code: 'FREESHIP',
      type: 'fixed',      // ประเภทส่วนลด
      value: 50,          // ค่าใช้จ่ายส่วนลด
      minPurchase: 500,   // ยอดซื้อขั้นต่ำ
      maxDiscount: 50,    // ส่วนลดสูงสุด
      expiryDate: '2023-12-31' // วันหมดอายุ
    }
  ]
};
  
// Utility functions
export function log(type, message, data = null) {
  if (config.debug) {
    console.log(`[${type}] ${message}`, data || '');
  }
}
  

// Utility functions
export function log(type, message, data = null) {
  if (config.debug) {
    console.log(`[${type}] ${message}`, data || '');
  }
}
