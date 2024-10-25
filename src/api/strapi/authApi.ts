// src\api\strapi\authApi.ts

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1400"; // Fallback to default if env variable not set

export const authenticateUser = async (
  identifier: string,
  password: string
) => {
  try {
    const url = `${API_URL}/api/auth/local`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'accept': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!response.ok) {
      // Handle errors if the response status is not OK (e.g., 4xx or 5xx)
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

export const registerUser = async (userData: Record<string, any>) => {
  try {
    const url = `${API_URL}/api/auth/local/register`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      // Handle errors if the response status is not OK (e.g., 4xx or 5xx)
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
