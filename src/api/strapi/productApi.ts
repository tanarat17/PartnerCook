// src/api/strapi/productApi.ts
import { Product } from "./types";
import { sendMessageCreateProduct } from "./lineBotService/serviceLineBotApi";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1400";

export const getAllProductsByShopId = async (
  token: string,
  shopId: number
): Promise<Product[]> => {
  try {
    console.log("Fetching products for shop ID:", shopId);
    const url = `${API_URL}/api/products?populate[image]=true&populate[shop]=true&filters[shop][$eq]=${shopId}`;
    console.log("GET Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // ใส่ token ถ้าจำเป็น
        // Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching products:", errorData);
      throw new Error(
        `Request failed with status ${response.status}: ${
          errorData.message || "Unauthorized"
        }`
      );
    }

    const data = await response.json();
    console.log("Fetched Products Data:", data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Fetched data is not an array:", data);
      throw new Error("Invalid data format");
    }

    const products: Product[] = data.data.map((item: any, index: number) => {
      console.log(`Processing product ${index}:`, item);
      if (!item || typeof item !== "object" || !item.attributes) {
        console.error(`Invalid product at index ${index}:`, item);
        throw new Error(`Invalid product data at index ${index}`);
      }

      // ตรวจสอบข้อมูลที่เกี่ยวกับร้านค้า
      const shopData = item.attributes.shop || {};
      return {
        id: item.id,
        name: item.attributes.name || "ไม่ระบุชื่อสินค้า",
        description: item.attributes.description || "ไม่มีรายละเอียด",
        price: item.attributes.price || 0, // ตั้งค่าราคาเริ่มต้นเป็น 0 หากไม่มี
        point: item.attributes.point || null,
        approved: item.attributes.approved || false,
        createdAt: item.attributes.createdAt || null,
        updatedAt: item.attributes.updatedAt || null,
        publishedAt: item.attributes.publishedAt || null,
        image: item.attributes.image || null,
        shop: {
          id: shopData.id || null,
          name: shopData.name || "ไม่ระบุชื่อร้านค้า",
          location: shopData.location || null,
          latitude: shopData.latitude || null,
          longitude: shopData.longitude || null,
          createdAt: shopData.createdAt || null,
          updatedAt: shopData.updatedAt || null,
          publishedAt: shopData.publishedAt || null,
        },
        numStock: item.attributes.numStock || 0, // เพิ่มฟิลด์ numStock และตั้งค่าเริ่มต้นเป็น 0 หากไม่มี
        type: item.attributes.type || "ไม่ระบุประเภทสินค้า",
      };
    });

    console.log("Parsed Products:", products);
    return products;
  } catch (error: any) {
    console.error("Error fetching products:", error.message);
    throw error;
  }
};

export const addProduct = async (
  token: string,
  userLineId: string,
  productData: Record<string, any>
) => {
  try {
    const url = `${API_URL}/api/products`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ data: productData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding product:", errorData);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    sendMessageCreateProduct(userLineId);
    return data;
  } catch (error) {
    console.error("Error in addProduct function:", error);
    throw error;
  }
};

export const updateProduct = async (
  token: string,
  userLineId: string,
  productId: number,
  productData: Record<string, any>
) => {
  try {
    const url = `${API_URL}/api/products/${productId}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error updating Product:", errorData);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Updated Product Data:", data);
    sendMessageCreateProduct(userLineId);
    return data;
  } catch (error: any) {
    console.error("Error updating Product:", error.message);
    throw error;
  }
};

export const getShopId = async (
  token: string,
  shopName: string
): Promise<number | null> => {
  try {
    const url = `${API_URL}/api/shops?filters[name][$eq]=${shopName}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching shop ID:", errorData);
      throw new Error(
        `Request failed with status ${response.status}: ${
          errorData.message || "Unauthorized"
        }`
      );
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const shop = data.data[0];
      return shop.id;
    } else {
      console.warn("No shop found with the provided name.");
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching shop ID:", error.message);
    throw error;
  }
};

// src\api\strapi\productApi.ts
export const getProductByID = async (
  token: string,
  userLineId: number,
  productId: number,
  productData: Record<string, any>
) => {
  try {
    console.log("getProductByID", productId);
    const url = `${API_URL}/api/products/${productId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${token}`, // ใช้ token ถ้าจำเป็น
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching ProductByID ID:", errorData);
      throw new Error(
        `Request failed with status ${response.status}: ${
          errorData.message || "Unauthorized"
        }`
      );
    }

    const data = await response.json();
    console.log("Response ProductAPI :", data);

    if (data.data) {
      const product = data.data;

      // ดึงข้อมูลจาก attributes
      const attributes = product.attributes || {};
      const id = product.id || "ID ไม่ระบุ"; // ตรวจสอบ ID
      const name = attributes.name || "ชื่อไม่ระบุ"; // ตรวจสอบชื่อ
      const description = attributes.description || "ไม่มีคำอธิบาย"; // ตรวจสอบคำอธิบาย
      const price =
        attributes.price !== undefined ? attributes.price : "ไม่มีราคา"; // ตรวจสอบราคา
      const numStock =
        attributes.numStock !== undefined
          ? attributes.numStock
          : "ไม่มีข้อมูลจำนวนในสต็อก"; // ตรวจสอบจำนวนในสต็อก
      const approved =
        attributes.approved !== undefined
          ? attributes.approved
          : "สถานะไม่ระบุ"; // ตรวจสอบสถานะการอนุมัติ

      console.log(`Product ID: ${id}`);
      console.log(`Product Name: ${name}`);
      console.log(`Description: ${description}`);
      console.log(`Price: ${price}`);
      console.log(`Number in Stock: ${numStock}`);
      console.log(`Approved: ${approved}`);

      return { id, name, description, price, numStock, approved };
    } else {
      console.warn("No ProductByID found with the provided ID.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching ProductByID:", error.message);
    throw error;
  }
};
