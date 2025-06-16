# LUCKY Delivery - ระบบสั่งซื้อสินค้าออนไลน์ (Static Web)

## โครงสร้างโปรเจกต์
- index.html : หน้าเลือกสินค้า
- form.html : กรอกข้อมูลลูกค้า
- summary.html : สรุปคำสั่งซื้อ/อัปโหลดสลิป
- receipt.html : ใบเสร็จ/ดาวน์โหลด PDF
- admin.html : จัดการสินค้า/ราคา และดูออเดอร์ย้อนหลัง (เฉพาะเครื่อง)
- order.js, form.js, summary.js, receipt.js, admin.js : สคริปต์แต่ละหน้า
- style.css : ธีมหลัก

## วิธี Deploy ขึ้น GitHub Pages
1. สร้าง repository ใหม่บน GitHub
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น repo
3. ไปที่ Settings > Pages > Source: เลือก branch (main/master) และ root
4. รอระบบ build แล้วเข้าใช้งานผ่าน URL ที่ GitHub ให้มา

## ข้อจำกัด (สำคัญ!)
- ระบบนี้ demo ด้วย localStorage ข้อมูลสินค้า/ออเดอร์จะไม่ sync ข้ามเครื่อง/เบราว์เซอร์
- ถ้าต้องการใช้งานจริง (ข้อมูลกลาง, admin เห็นข้อมูลตรงกัน, ไม่หาย) ต้องเชื่อมต่อ backend หรือฐานข้อมูลออนไลน์ เช่น Firebase, Supabase, Google Sheets API ฯลฯ
- หากต้องการอัปเกรดระบบให้รองรับการใช้งานจริง ติดต่อผู้พัฒนา/แจ้งใน Issues

## หมายเหตุ
- ทุกลิงก์เป็น relative path เหมาะกับ static hosting
- สามารถแก้ไขสินค้า/ราคา/ขั้นต่ำ ได้จากหน้า admin.html (แต่ข้อมูลจะอยู่เฉพาะเครื่อง)
- รองรับมือถือ 100% และ UI/UX ทันสมัย
