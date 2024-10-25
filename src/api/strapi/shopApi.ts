// src/api/strapi/shopApi.ts
import { Shop, Bank, Product } from './types';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  

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
            bank: item.attributes.bank,
            image: item.attributes.image,
        }));
        return shops;
    } catch (error) {
        console.error('Error fetching shops:', error.message);
        throw error;
    }
};


export const getRedeemIdByProductId = async (shopId: string, productId: string): Promise<string | null> => {
    try {
      const redeemData = await fetchShopRedeem(shopId);
      const redeems = redeemData.data.attributes.redeems.data;
      const matchedRedeem = redeems.find(redeem => {
        const productJson = redeem.attributes.productJsonArray;
        const products = JSON.parse(productJson);
        return products.some(product => product.id === productId);
      });
      return matchedRedeem ? matchedRedeem.id : null;
    } catch (error) {
      console.error("Error fetching redeem data:", error);
      return null;
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
        const response = await fetch(`${API_URL}/api/users/${userId}?populate[shop][populate]=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`, // Uncomment if needed
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching shop by ID:', errorData);
            throw new Error(`Request failed with status ${response.status}: ${errorData.message || ''}`);
        }

        // ใช้ response.json() แทน response.text()
        const data = await response.json();

        if (!data || !data.shop) {
            throw new Error('No shop data returned from the server');
        }

        return data;
    } catch (error) {
        console.error('Error fetching shop by ID:', error);
        throw error;
    }
};


  const getRedeemByShop = async (shopId) => {
    const response = await fetch(`/shops/${shopId}?populate=redeems`);
    const data = await response.json();
    console.log("GetRedeemBtShop : " + data)
    return data.redeems;
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


export const updateUserFromShop = async (token: string,userId : string ,userData: Record<string, any>) => {
    
    console.log("updateUserFromShop :: ")
    console.log("UserID :: "+ userId);
    console.log("UserData :: "+userData);
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
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching products:', errorData);
            throw new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unauthorized'}`);
        }

        const data = await response.json();
        console.log('Fetched Products Data:', data); 

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
            method: 'PUT', 
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
  
    try {
        const url = `${API_URL}/api/banks`; 
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Authorization: `Bearer ${token}`,
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


        console.log(banksData)
        return banksData;
    } catch (error) {
        console.error('Error fetching banks:', error.message);
        throw error;
    }
};

export const fetchShopInvoices = async (shopId) => {
    try {
        // ปรับให้รวม populate สำหรับ redeem และ customer
        const url = `${API_URL}/api/shops/${shopId}?populate[invoices][populate]=redeem.customer`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching invoices:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Invoices data received:", data);
        return data;
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw error;
    }
};


export const fetchShopRedeem = async (shopId) => {
    try {
        const url = `${API_URL}/api/shops/${shopId}?populate=redeems`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching redeem data:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching redeem data Back-END :', error);
        throw error;
    }
};

const updateRedeemStatus = async (token, redeemId, updateData) => {
    try {
        const url = `http://localhost:1337/api/redeems/${redeemId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data: updateData })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating Redeem status:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating Redeem status:', error);
        throw error;
    }
};





