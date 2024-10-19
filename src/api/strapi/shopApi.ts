// src/api/strapi/shopApi.ts
import { Shop, Bank } from './types';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const getAllShops = async (token: string): Promise<Shop[]> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    try {

        const url = `${API_URL}/api/shops/?populate=image`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shops:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const shops: Shop[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes.name,
            location: item.attributes.location,
            latitude: item.attributes.latitude,
            longitude: item.attributes.longitude,
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
            bookBankNumber: item.attributes.bookBankNumber,
            image: item.attributes.image,
        }));
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error.message);
        throw error;
    }
};

export const getShopsByUserID = async (token, shopId) => {
    try {

        const url = `${API_URL}/api/shops/${shopId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shops:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
    } catch (error) {
        console.error('Error fetching shop by ID:', error);
        throw error; 
    }
};

export const getShopById = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}?populate=shop`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching shops:', errorData);
          throw new Error(`Request failed with status ${response.status}`);
        }
      
        const data = await response.json();

        if (!data.shop) {
        //   console.error('Invalid shop data:', data);
          throw new Error('Shop data is undefined or missing.');
        }
      
        const shopId = data.shop.id; 
      
        return data; 
      } catch (error) {
        // console.error('Error fetching shop by ID:', error);
        throw error; 
      }
      
      
  };
  





export const createShop = async (token: string, shopData: Record<string, any>) => {

    try {
        const url = `${API_URL}/api/shops`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shopData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating shop:', error.message);
        throw error;
    }
};


// ฟังก์ชันสำหรับสร้าง Shop
//  export const createShop = async (token: string, shopData: Record<string, any>) => {
//     try {
//         const url = `${API_URL}/api/shops`; // URL ของ API สำหรับสร้างร้านค้า

//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(shopData), // ส่งข้อมูลร้านค้า
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`Error creating shop: ${errorData.message}`);
//         }

//         const data = await response.json();
//                  return data;
//     } catch (error) {
//         console.error('Error creating shop:', error.message);
//                  throw error;
//     }
// };


// export const updateUserFromShop = async (token, userId, UserData: Record<string, any>) => {
//     try {
//         // กำหนด URL สำหรับอัพเดตผู้ใช้
//         const url = `${API_URL}/api/users/${userId}`; 

//         // ส่งคำขอ HTTP PUT เพื่ออัพเดต fullName, cardID, และ address (จาก location)
//         const response = await fetch(url, {
//             method: 'PUT',
//             headers: {
//                 Authorization: `Bearer ${token}`, // ส่ง token สำหรับการตรวจสอบสิทธิ์
//                 'Content-Type': 'application/json', // กำหนดว่าเนื้อหาที่ส่งเป็น JSON
//             },
//             // body: JSON.stringify({ fullName, cardID, address: location }), // ส่ง fullName, cardID และ address (location) ในรูปแบบ JSON
//             body: JSON.stringify({ data: UserData }),
//         });


//         console.log(response)
//         // ตรวจสอบว่า response สำเร็จหรือไม่
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(`Error updating user: ${errorData.message}`);
//         }

//         const data = await response.json();
//         console.log('UpdateUser ' + data)
//         return data;
//     } catch (error) {
//         console.error('Failed to update user:', error);
//         throw error; // ส่งต่อข้อผิดพลาด
//     }
// };


export const updateUserFromShop = async (token: string,userId : string ,userData: Record<string, any>) => {

    try {
        const url = `${API_URL}/api/users/${userId}`; 

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData), 
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating UserFromShop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating UserFromShop:', error.message);
        throw error;
    }
};



export const getAllShopById = async (token: string, shopId: number): Promise<Shop[]> => {
    try {
        console.log('Fetching Shop for shop ID:', shopId);
        const url = `${API_URL}/api/Shops?populate[image]=true&populate[shop]=true&filters[shop][$eq]=${shopId}`;
        console.log('GET Request URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching products:', errorData);
            throw new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unauthorized'}`);
        }

        const data = await response.json();
        console.log('Fetched Products Data:', data); // ตรวจสอบโครงสร้างข้อมูล

        // สมมุติว่าโครงสร้างเป็น { data: [ ... ], meta: { ... } }
        if (!data.data || !Array.isArray(data.data)) {
            console.error('Fetched data is not an array:', data);
            throw new Error('Invalid data format');
        }

        const products: Product[] = data.data.map((item: any, index: number) => {
            console.log(`Processing product ${index}:`, item);
            if (!item || typeof item !== 'object') {
                console.error(`Invalid product at index ${index}:`, item);
                throw new Error(`Invalid product data at index ${index}`);
            }

            return {
                id: item.id,
                name: item.attributes.name,
                description: item.attributes.description,
                price: item.attributes.price,
                point: item.attributes.point,
                approved: item.attributes.approved,
                createdAt: item.attributes.createdAt,
                updatedAt: item.attributes.updatedAt,
                publishedAt: item.attributes.publishedAt,
                image: item.attributes.image || null,
                shop: {
                    id: item.attributes.shop.id,
                    name: item.attributes.shop.name,
                    location: item.attributes.shop.location,
                    latitude: item.attributes.shop.latitude,
                    longitude: item.attributes.shop.longitude,
                    createdAt: item.attributes.shop.createdAt,
                    updatedAt: item.attributes.shop.updatedAt,
                    publishedAt: item.attributes.shop.publishedAt,
                },
                numStock: item.attributes.numStock || 0, 
            };
        });

        console.log('Parsed Products:', products);
        return products;
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};













export const updateShop = async (token: string, shopId: number, shopData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/shops/${shopId}`;

        const response = await fetch(url, {
            method: 'PUT',  // Use 'PATCH' if you only want to update certain fields
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: shopData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating shop:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating shop:', error.message);
        throw error;
    }
};



export const getBank = async (token: string): Promise<Bank[]> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    try {
        const url = `${API_URL}/api/banks`; 
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching banks:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data || !data.data) {
            console.error('No data found in response');
            return [];
        }

        const banksData: Bank[] = data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes.name, // ชื่อธนาคาร
            createdAt: item.attributes.createdAt,
            updatedAt: item.attributes.updatedAt,
            publishedAt: item.attributes.publishedAt,
        }));

        return banksData;
    } catch (error) {
        console.error('Error fetching banks:', error.message);
        throw error;
    }
};


