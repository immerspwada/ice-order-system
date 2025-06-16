// form.js - Step 2: Customer Info Form
// Clean, modular JS for customer info and sessionStorage

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('customerForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
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
    const customerInfo = { name, phone, address };
    sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
    window.location.href = 'summary.html';
  });
});