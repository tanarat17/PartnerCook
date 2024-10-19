// src/api/strapi/uploadApi.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set

// export const uploadImage = async (imageFile: File): Promise<any> => {
//     return new Promise((resolve, reject) => {
//         const url = `${API_URL}/api/upload`;

//         const formData = new FormData();
//         formData.append('files', imageFile);

//         const xhr = new XMLHttpRequest();
//         xhr.open('POST', url, true);

//         // Set up event listeners for success and error
//         xhr.onload = function () {
//             if (xhr.status >= 200 && xhr.status < 300) {
//                 try {
//                     const responseJson = JSON.parse(xhr.responseText);
//                     console.log(responseJson);
//                     resolve(responseJson);
//                 } catch (error) {
//                     console.error('Error parsing response:', error);
//                     reject(new Error('Failed to parse server response'));
//                 }
//             } else {
//                 console.error('Upload failed:', xhr.statusText);
//                 reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
//             }
//         };

//         xhr.onerror = function () {
//             console.error('Network error');
//             reject(new Error('Network error'));
//         };

//         xhr.send(formData);
//     });
// };
export const uploadImage = async (imageFile: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const url = `${API_URL}/api/upload`;

      const formData = new FormData();
      formData.append("files", imageFile); // 'files' is the key expected by Strapi or your backend

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
          resolve(data[0]); // Assuming data[0] contains the uploaded file's information
        })
        .catch((error) => {
          reject(error);
        });
    });
  };