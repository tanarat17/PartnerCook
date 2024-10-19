// src/api/strapi/serviceLineBotApi.ts
import axios from 'axios';

// ตัวแปร Token ของ Line Bot
const LineBotToken = import.meta.env.VITE_TOKEN_TEST;

// ฟังก์ชันสำหรับส่งข้อความเมื่อสินค้าถูกสร้างเพื่อรออนุมัติ
export const sendMessageCreateProduct = async (userId: string) => {
  try {
    const response = await axios.post('/api', {
      to: userId, // ผู้รับข้อความ
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
  }
};

export const sendMessageApproveProduct = async (userId: string) => {
  try {
    const response = await axios.post('/api', {
      to: userId, // ผู้รับข้อความ
      messages: [{
        type: 'text', // ประเภทของข้อความ
        text: 'สินค้าของคุณได้รับการอนุมัติแล้ว!', // ข้อความที่จะส่ง
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
  }
};
