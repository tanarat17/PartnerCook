// src/pages/Login.jsx

import { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import { loginWithLineId } from '../api/business/login';
import { createUser, getUser } from '../api/strapi/userApi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [profile, setProfile] = useState(null);
    const [accessToken, setAccessToken] = useState('');
    const [userData, setUserData] = useState(null); // State สำหรับเก็บข้อมูลผู้ใช้
    const [errorMessage, setErrorMessage] = useState('');
    const { isReady, liff, error } = useLiff();
    const navigate = useNavigate();
    const liffidChanal = import.meta.env.VITE_LIFF_ID;
    // const lifid = localStorage.getItem('accessToken') || import.meta.env.VITE_TOKEN_TEST;
    useEffect(() => {
        const initializeLiff = async () => {
            try {
                await liff.init({ liffId: liffidChanal });
                if (liff.isLoggedIn()) {
                    const token = liff.getAccessToken();
                    setAccessToken(token);
                    const userProfile = await liff.getProfile();
                    setProfile(userProfile);
                    
                    const profileData = await fetchLineProfile(token);
                    setUserData(profileData); // เก็บข้อมูลโปรไฟล์ LINE

                    const response = await handleLineLogin(profileData);
                    if (response) {
                        navigate('/partner/shopHome');  // เปลี่ยนเส้นทางไปยังหน้า home
                    } else {
                        navigate('/partner/PDPA');  // เปลี่ยนเส้นทางไปยังหน้า Register
                    }
                } else {
                    liff.login();
                }
            } catch (err) {
                // console.error('LIFF initialization error:', err);
                setErrorMessage('Initialization failed. Please try again.');
            }
        };

        if (isReady) {
            initializeLiff();
        }
    }, [isReady, liff, navigate]);

    const handleLineLogin = async (profileData) => {
        try {
            console.log(profileData);
            let existingUser;
            try {
                existingUser = await getUser(profileData.userId, accessToken);
            } catch (error) {
                console.log('User not found, proceeding to register.');
            }

            if (existingUser) {
                const loginResponse = await loginWithLineId(profileData.userId);
                if (loginResponse) {
                    localStorage.setItem('accessToken', loginResponse.jwt);
                    localStorage.setItem('user', JSON.stringify(loginResponse.user));
                    return true;
                }
            } else {
                const registerResponse = await createUser({
                    username: `cook${profileData.userId}`,
                    email: `cook${profileData.userId}@cook.com`,
                    password: 'cookcook',
                    lineId: profileData.userId,
                    userType: 'shop',
                    fullName: profileData.displayName,
                    // สมมติว่า profileData มีฟิลด์เหล่านี้
                    telNumber: profileData.telNumber || '',
                    gender: 'Null',
                    address: profileData.address || '',
                    cardID: profileData.cardID || '',
                });
                console.log('Registration response:', registerResponse);
                if (registerResponse) {
                    const loginResponse = await loginWithLineId(profileData.userId);
                    if (loginResponse) {
                        localStorage.setItem('accessToken', loginResponse.jwt);
                        localStorage.setItem('user', JSON.stringify(loginResponse.user));
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error handling LINE login:', error.message);
            setErrorMessage('Login failed. Please try again.');
            return false;
        }
    };

    const fetchLineProfile = async (token) => {
        try {
            const response = await fetch('https://api.line.me/v2/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching profile:', errorData);
                throw new Error(errorData.message || 'Failed to fetch profile');
            }

            const profileData = await response.json();
            console.log('Profile Data:', profileData);
            return profileData;
        } catch (error) {
            console.error('Error:', error.message);
            setErrorMessage('Failed to fetch profile. Please try again.');
            throw error;
        }
    };

    // return (
    //     // <div className="App">
    //     //     <header className="App-header">
    //     //         {error && <p>Something went wrong: {error.message}</p>}
    //     //         {!isReady ? (
    //     //             <p></p>
    //     //         ) : !liff.isLoggedIn() ? (
    //     //             <button onClick={() => liff.login()}>Login with LINE</button>
    //     //         ) : profile ? (
    //     //             <div>
    //     //                 <p>Welcome, {profile.displayName}!</p>
    //     //                 {/* แสดงข้อมูลผู้ใช้ที่ดึงมา */}
    //     //                 {userData && (
    //     //                     <div>
                               
                              
    //     //                     </div>
    //     //                 )}
                     
    //     //             </div>
    //     //         ) : (
    //     //             <p></p>
    //     //         )}
    //     //         {errorMessage && <p className="error">{errorMessage}</p>}
    //     //     </header>
    //     // </div>
    // );
};

export default Login;
