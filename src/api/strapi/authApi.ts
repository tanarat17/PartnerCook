const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1400";
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
      },
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.error?.message || 'Unknown error');
      throw new Error(`Request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
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
      const errorData = await response.json();
      console.error("Error:", errorData);
      throw new Error(`Request failed with status ${response.status}: ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // โยนข้อผิดพลาดเพื่อให้สามารถจัดการได้ในฟังก์ชันที่เรียกใช้งาน
  }
};
