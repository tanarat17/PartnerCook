// src/api/strapi/shopApi.ts
import { Shop } from './types';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

export const getAllShops = async (token: string): Promise<Shop[]> => {
    if (!token) {
        throw new Error('No token provided. User must be authenticated.');
    }
    try {
        // const API_URL = 'https://cookbstaging.careervio.com'
        // /api/shops/?populate=image
        const url = `${API_URL}/api/shops/?populate=image`;
        // console.log('url', url);
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
        console.log('data', data);
        // Map the response data to an array of Shop objects
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
        console.log('shops', shops);
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error.message);
        throw error;
    }
};

export const getShopsByUserID = async (token, shopId) => {
    try {
        // const response = await axios.get(`${API_URL}/api/shops/${shopId}`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });

        const url = `${API_URL}/api/shops/${shopId}`;
        // console.log('url', url);
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
        console.log('data', data);



        // return response.data.data; // คืนค่าข้อมูลที่ได้รับจาก API
    } catch (error) {
        console.error('Error fetching shop by ID:', error);
        throw error; // ส่งต่อข้อผิดพลาดเพื่อจัดการในระดับสูงกว่า
    }
};

export const getShopById = async (token, userId) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}?populate=shop`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': token ? `Bearer ${token}` : undefined,
          },
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching shops:', errorData);
          throw new Error(`Request failed with status ${response.status}`);
        }
      
        const data = await response.json();
        console.log('data API:', data); // แสดงข้อมูลที่ได้รับจาก API
      
        // ตรวจสอบว่า shop มีอยู่จริงหรือไม่
        if (!data.shop) {
          console.error('Invalid shop data:', data);
          throw new Error('Shop data is undefined or missing.');
        }
      
        // ดึง shop id
        const shopId = data.shop.id; // ดึง shop id
        console.log('Shop ID:', shopId);
      
        return data; // Return the data portion of the response
      } catch (error) {
        console.error('Error fetching shop by ID:', error);
        throw error; // Propagate the error to be handled in the calling function
      }
      
      
  };
  





export const createShop = async (token: string, shopData: Record<string, any>) => {

    console.log('CreateShop :: ' + JSON.stringify(shopData)); 

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
