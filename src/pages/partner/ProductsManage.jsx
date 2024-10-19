// ProductsManage.jsx\

import { notifyProductAddition, notifyProductApproval } from './lineNotify';

// เรียกใช้งานเมื่อมีการเพิ่มสินค้า
const addProduct = async (productDetails) => {
    // โค้ดการเพิ่มสินค้าในฐานข้อมูล

    // ส่งข้อความแจ้งเตือน
    notifyProductAddition(productDetails);
};

// เรียกใช้งานเมื่อสินค้าถูกอนุมัติ
const approveProduct = async (productDetails) => {
    // โค้ดการเปลี่ยนแปลงสถานะในฐานข้อมูล

    // ส่งข้อความแจ้งเตือน
    notifyProductApproval(productDetails);
};