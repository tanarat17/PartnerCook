// src/api/strapi/uploadApi.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set


export const uploadImage = async (imageFile: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/api/upload`;

      const formData = new FormData();
      formData.append("files", imageFile); 

      fetch(url, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              reject(errorData);
            });
          }
          return response.json();
        })
        .then((data) => {
          resolve(data[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };