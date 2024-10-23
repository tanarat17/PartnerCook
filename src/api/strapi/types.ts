// src/api/strapi/types.ts

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string; // เปลี่ยนจาก number เป็น string
    gender: string;
    address: string;
    cardIDv: string;
    telNumber: string;
    point: number; // ใช้ตัวพิมพ์เล็กสำหรับ primitive types
  }
  
  export interface Shop {
    id: number;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    bookBankNumber: string | null;
    image: number;
    bookBankImage: number;
    bank: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    approved: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    shop: {
      id: number;
      name: string;
      location: string;
      latitude: number;
      longitude: number;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }
  
  export interface RecycleMachine {
    id: number;
    location: string;
    latitude: string;
    longitude: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
  
  export interface OilMachine {
    id: number;
    location: string;
    latitude: string;
    longitude: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }


  export interface Bank {
    id: number;
    name: string; // ชื่อธนาคาร
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}
  

export interface Redeem {
  customer: User; 
  totalPoints: number;
  qrCode: string; 
  status: 'pending' | 'completed' | 'canceled'; 
  invoice: Invoice; 
  productJsonArray: Record<string, any>[]; 
  shop: Shop;
  date: string; 
  time: string; 
}


export interface Invoice {
  id: number; 
  amount: number; 
  status: 'pending' | 'paid' | 'canceled'; 
  transferImage: number;
  redeem: Redeem;
  productJsonArray: Record<string, any>[];
  invoiceNumber: string;
  shop: Shop;
}