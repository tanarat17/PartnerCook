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
          console.error('Invalid shop data:', data);
          throw new Error('Shop data is undefined or missing.');
        }
      
        const shopId = data.shop.id; 
      
        return data; 
      } catch (error) {
        console.error('Error fetching shop by ID:', error);
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

export const updateShop = async (token: string, shopId: number, shopData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/shops/${shopId}`;

        const response = await fetch(url, {
            method: 'PATCH',  // Use 'PATCH' if you only want to update certain fields
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


