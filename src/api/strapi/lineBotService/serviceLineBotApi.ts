// src/api/strapi/serviceLineBotApi.ts
import axios from 'axios';

// ตัวแปร Token ของ Line Bot
const LineBotToken = import.meta.env.VITE_TOKEN_TEST;

// ฟังก์ชันสำหรับส่งข้อความเมื่อสินค้าถูกสร้างเพื่อรออนุมัติ
export const sendMessageCreateProduct = async (userLineId: string) => {
  try {
      const response = await axios.post('/api', {
          to: userLineId, // ผู้รับข้อความ
          messages: [{
              type: 'text', // ประเภทของข้อความ
              text: 'ส่งสินค้าเพื่อรออนุมัติ', // ข้อความที่จะส่ง
          }],
      }, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${LineBotToken}`, 
          },
      });

      console.log('Success:', response.data);
  } catch (error) {
      console.error('Error:', error.response?.data || error.message);

      if (error.response && error.response.data && error.response.data.message.includes("Authentication failed")) {
          console.error('Token is invalid or expired. Please refresh your token.');
      }
  }
};

