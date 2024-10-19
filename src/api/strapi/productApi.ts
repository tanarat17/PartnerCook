// src/api/strapi/productApi.ts
import { Product } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400'; // Fallback to default if env variable not set

export const getAllProductsByShopId = async (token: string, shopId: number): Promise<Product[]> => {
    try {
        console.log('Fetching products for shop ID:', shopId);
        const url = `${API_URL}/api/products?populate[image]=true&populate[shop]=true&filters[shop][$eq]=${shopId}`;
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
                numStock: item.attributes.numStock || 0, // เพิ่มฟิลด์ numStock และตั้งค่าเริ่มต้นเป็น 0 หากไม่มี
            };
        });

        console.log('Parsed Products:', products);
        return products;
    } catch (error: any) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

export const addProduct = async (token: string, productData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/products`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': token ? `Bearer ${token}` : undefined,
            },
            body: JSON.stringify({ data: productData }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding product:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data; // คืนค่าผลลัพธ์จาก API
    } catch (error) {
        console.error('Error in addProduct function:', error);
        throw error; // ส่งต่อข้อผิดพลาด
    }
};

export const updateProduct = async (token: string, productId: number, productData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/products/${productId}`; // ใช้ URL สำหรับการอัปเดต

        const response = await fetch(url, {
            method: 'PUT', // หรือใช้ PATCH หากต้องการอัปเดตเฉพาะบางฟิลด์
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
        return data;
    } catch (error: any) {
        console.error('Error updating Product:', error.message);
        throw error;
    }
};



export const saveProduct = async (token: string, productData: Record<string, any>) => {
    try {
        const url = `${API_URL}/api/products`; // URL สำหรับการเพิ่มหรืออัปเดตสินค้า

        // สร้างข้อมูลที่จะส่งไปยัง API
        const requestData = {
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
        };

        // หากมี productData.id แสดงว่าต้องการอัปเดตสินค้า
        if (productData.id) {
            requestData.data.id = productData.id; // เพิ่ม ID สำหรับการอัปเดต
        }

        const response = await fetch(url, {
            method: 'POST', // ใช้ POST สำหรับการเพิ่มหรืออัปเดต
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // เพิ่ม Authorization ถ้าใช้ token
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error saving product:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Saved Product Data:', data);
        return data;
    } catch (error: any) {
        console.error('Error in saveProduct function:', error.message);
        throw error;
    }
};






export const getShopId = async (token: string, shopName: string): Promise<number | null> => {
    try {
        const url = `${API_URL}/api/shops?filters[name][$eq]=${shopName}`;
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
