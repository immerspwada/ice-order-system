// config.js - Shared configuration for LIFF and other constants
window.config = {
  liffId: '2006986568-yjrOkKqm', // FIXME: Replace with your real LIFF ID from LINE Developer Console
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
      type: 'fixed',
      value: 50,
      minPurchase: 500,
      maxDiscount: 50,
      expiryDate: '2023-12-31'
    }
  ]
};
window.log = function(type, message, data = null) {
  if (window.config && window.config.debug) {
    console.log(`[${type}] ${message}`, data || '');
  }
};
// Helper: get safe redirectUri for LIFF login
window.getRedirectUri = function() {
  return window.location.origin + window.location.pathname;
};

window.addEventListener('error', function(e) {
  console.error('Global error:', e.error || e.message || e);
});
