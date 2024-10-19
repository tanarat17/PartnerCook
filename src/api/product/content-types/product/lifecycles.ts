// src/api/product/content-types/product/lifecycles.ts
// import { Strapi } from '@strapi/strapi';

import { sendMessageCreateProduct, sendMessageApproveProduct } from '../../../strapi/lineBotService/serviceLineBotApi';

export const lifecycles = {
    async afterCreate(event) {
      const { result } = event;
      const userId = "530063755032133953"; // ค่า userId ที่ต้องการ
  
      // ส่งข้อความว่ารอการอนุมัติ
      await sendMessageCreateProduct(userId);
    },
  
    async afterUpdate(event) {
      const { result, params } = event;
  
      // ตรวจสอบว่ามีการเปลี่ยนแปลงสถานะเป็นอนุมัติหรือไม่
      // ตรวจสอบว่าตอนนี้ approved เป็น true และก่อนหน้านี้เป็น false
      if (result.approved === true && params?.data?.approved === true) {
        const userId = "530063755032133953"; // ค่า userId ที่ต้องการ
  
        // ส่งข้อความว่าสินค้าได้รับการอนุมัติ
        await sendMessageApproveProduct(userId);
      }
    },
  };