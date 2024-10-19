// src\api\strapi\userApi.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1400';  // Fallback to default if env variable not set
import { User } from './types';
export const updateUser = async (userId: number, userData: Record<string, any>, token: string) => {
    try {
        const url = `${API_URL}/api/users/${userId}`;  

        const response = await fetch(url, {
            method: 'PUT',  
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
};

export const getUser = async (userId: string, token: string): Promise<User> => {
    if (!userId || !token) {
        throw new Error('No userId or token provided. User must be authenticated.');
    }

    try {
        const lowerCaseUserId = userId.toLowerCase(); 
        console.log('lowerCaseUserId', lowerCaseUserId);
        const url = `${API_URL}/api/users?populate[photoImage]=true&filters[lineId][$eq]=${lowerCaseUserId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching user:', errorData);
            throw new Error(`Request failed with status ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
        }
        const data = await response.json();
        console.log('data', data); 

        if (!data || !Array.isArray(data)) {
            throw new Error('Invalid response format: Expected an array of user data.');
        }

        // // If data.data is an empty array
        console.log('data.data.length', data.length); 
        console.log('data[0].attributes.username', data[0].username);
        if (data.length === 0) {
            throw new Error('No user found with the provided lineId.');
        }
        const user ={
            id: data[0].id,
            username: data[0].username,
            email: data[0].email,
            fullName: data[0].fullName,
            lineId: data[0].lineId,
            gender: data[0].gender,
            address: data[0].address,
            cardID: data[0].cardID,
            telNumber: data[0].telNumber,
            userType: data[0].userType,
            point: data[0].point,
            photoImage: data[0].photoImage,
        };

        console.log('users', user);
        return user;

    } catch (error: any) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
};

export const createUser = async (userData: Record<string, any>, token: string): Promise<User> => {
    try {
        console.log('userData in createUser: ', userData);
        const url = `${API_URL}/api/auth/local/register`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        console.log('body: ', JSON.stringify(userData));
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            // alert('Error: ' + errorData.error.message);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
