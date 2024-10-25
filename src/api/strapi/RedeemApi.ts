// src/api/strapi/productApi.ts
import { Redeem } from "./types";
import { sendMessageCreateProduct } from "./lineBotService/serviceLineBotApi";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1400";

export const getRedeemByUserId = async (token: string, userId: string) => {
  try {
    console.log("getRedeemByUserId : " + userId);
    const url = `${API_URL}/api/redeems/${userId}`;

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

// const fetchInvoices = async () => {
//     try {
//       const token = "your_token_here"; // ใส่ token ที่ได้รับจากการเข้าสู่ระบบ
//       const response = await fetch(`/invoices?shopId=${shopId}`, {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setInvoices(data);
//     } catch (error) {
//       console.error("Error fetching invoices:", error);
//     }
//   };

export const fetchInvoices = async (token, shopId) => {
  try {
    const response = await fetch(`/invoices?shopId=${shopId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Redeem data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Redeem data:", error);
    return null;
  }
};

export const updateRedeem = async (
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

export const fetchRedeemData = async (productId, shopId) => {
  console.log("Handle Redeem Back : " + productId, shopId);

  try {
    const response = await fetch(
      `${API_URL}/api/redeems?filters[shop][$eq]=${shopId}&filters[productJsonArray][$contains]=${JSON.stringify(
        [{ id: productId }]
      )}`
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error fetching redeem data: ${response.status} ${response.statusText}. Message: ${errorMessage}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching redeem data from Strapi:", error);
    return null;
  }
};

export const getRedeemByShop = async (token, shopId) => {
  try {
    const response = await fetch(
      `${API_URL}/redeems?filters[shop][id][$eq]=${shopId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Redeem data");
    }

    const data = await response.json();

    console.log("Redeem " + data);
    return data;
  } catch (error) {
    console.error("Error fetching Redeem data:", error);
    return null;
  }
};

export const updateRedeemStatus = async (redeemId) => {
  try {
    const response = await fetch(`${API_URL}/api/redeems/${redeemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "Approve",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update redeem status: ${response.statusText}`);
    }

    console.log("Redeem status updated successfully");
  } catch (error) {
    console.error("Error updating redeem status:", error);
  }
};
