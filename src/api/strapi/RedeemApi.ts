// src/api/strapi/productApi.ts
import { Redeem } from './types';
import { sendMessageCreateProduct } from './lineBotService/serviceLineBotApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400'; 

export const getRedeemByUserId = async (token: string, userId: string) => {
    try {
        console.log("getRedeemByUserId : "+userId);
        const url = `${API_URL}/api/redeems/${userId}`;


        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shop ID:', errorData);
            throw new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unauthorized'}`);
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const shop = data.data[0];
            return shop.id; 
        } else {
            console.warn('No shop found with the provided name.');
            return null;
        }
    } catch (error: any) {
        console.error('Error fetching shop ID:', error.message);
        throw error;
    }
};



export const updateRedeem = async (token: string, userLineId: string, productId: number, productData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/products/${productId}`; 

        const response = await fetch(url, {
            method: 'PUT', 
            headers: {
                // Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    name: productData.name,
                    description: productData.description || "",
                    price: parseFloat(productData.price),
                    point: productData.point || 0,
                    approved: productData.approved || false,
                    numStock: parseInt(productData.numStock, 10),
                    type: productData.type,
                    shop: { id: productData.shopId }, 
                    image: productData.image ? [{ id: productData.image }] : [],
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating Product:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Updated Product Data:', data);
        sendMessageCreateProduct(userLineId);
        return data;

    } catch (error: any) {
        console.error('Error updating Product:', error.message);
        throw error;
    }
};


