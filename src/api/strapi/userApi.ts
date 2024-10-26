// src\api\strapi\userApi.ts
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1400"; // Fallback to default if env variable not set
import { User } from "./types";



export const updateUser = async (
  userId: number,
  userData: Record<string, any>,
  token: string
) => {
  try {
    const url = `${API_URL}/api/users/${userId}`; // Adjust the endpoint as per your API structure

    const response = await fetch(url, {
      method: "PUT", // Use 'PATCH' if only partial updates are allowed by your API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
export const getUser = async (userId: string, token: string): Promise<User | null> => {
  if (!userId || !token) {
    throw new Error("User ID and token are required.");
  }

  try {
    const lowerCaseUserId = userId.toLowerCase(); // แปลง userId เป็นตัวพิมพ์เล็ก
    const url = `${API_URL}/api/users?populate[photoImage]=true&filters[lineId][$eq]=${lowerCaseUserId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error fetching user: ${errorData.message || "Unknown error"}`);
    }

    const data = await response.json();

    // ตรวจสอบว่าข้อมูลที่ส่งกลับเป็นรูปแบบที่ถูกต้อง
    if (!data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format: Expected an array of user data.");
    }

    if (data.data.length === 0) {
      return null; // คืนค่า null หากไม่มีผู้ใช้
    }

    // สร้างวัตถุผู้ใช้จากข้อมูลที่ดึงมา
    const user = {
      id: data.data[0].id,
      username: data.data[0].username,
      email: data.data[0].email,
      fullName: data.data[0].fullName,
      lineId: data.data[0].lineId,
      gender: data.data[0].gender,
      address: data.data[0].address,
      cardID: data.data[0].cardID,
      telNumber: data.data[0].telNumber,
      userType: data.data[0].userType,
      point: data.data[0].point,
      photoImage: data.data[0].photoImage,
    };

    return user;
  } catch (error: any) {
    // จัดการข้อผิดพลาด
    // console.error("Error fetching user:", error.message);
    throw error;
  }
};


export const createUser = async (
  userData: Record<string, any>,
  token: string
): Promise<User> => {
  try {
    const url = `${API_URL}/api/auth/local/register`; // Adjust the endpoint as per your API structure

    const response = await fetch(url, {
      method: "POST",
      headers: {
        //  Authorization: `Bearer ${token}`,  // Include the JWT token in the Authorization header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      // alert('Error: ' + errorData.error.message);
      // throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};
