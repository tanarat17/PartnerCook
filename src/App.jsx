// C:\Project_OutSouce\Cook_lineOA\src\App.jsx

import React, { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import { useNavigate } from 'react-router-dom';
import { loginWithLineId } from './api/business/login';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST; 
const LiffPartner = import.meta.env.VITE_LIFF_ID;

const App = () => {
    const navigate = useNavigate();
    const { isLoggedIn, liff, error } = useLiff();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const initializeLiff = async () => {
            try {
                // Check if liff is defined and has the init function
                if (typeof liff === 'undefined') {
                    console.error("LIFF is undefined. Please check if the SDK is loaded correctly.");
                    setErrorMessage("LIFF is not loaded. Please refresh the page.");
                    return;
                }

                // Verify the liff.init method exists
                if (typeof liff.init !== 'function') {
                    // console.error("LIFF init method is not a function. Please check your LIFF SDK version.");
                    setErrorMessage("LIFF is not initialized correctly. Please try again.");
                    return;
                }

                // Initialize LIFF
                await liff.init({ liffId: LiffPartner });
                console.log("LIFF initialized successfully.");

                if (liff.isLoggedIn()) {
                    const profile = await liff.getProfile();
                    setDisplayName(profile.displayName);
                    const response = await loginWithLineId(profile.userId);

                    if (!response) {
                        // console.log("Login failed. Redirecting to shop registration page...");
                        navigate('/Login');
                    } else {
                        const { jwt, user } = response;
                        localStorage.setItem('accessToken', jwt);
                        localStorage.setItem('user', JSON.stringify(user));
                        console.log('Token and user data saved to localStorage');
                        navigate('/partner/ProfileStore');
                    }
                } else {
                    liff.login();
                }
            } catch (err) {
                // console.error('Initialization or login error:', err);
                setErrorMessage('Initialization or login error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        initializeLiff();
    }, [liff, navigate]);

    const handleLogout = () => {
        if (liff) {
            liff.logout();
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/'); // Redirect to login page
    };

    if (loading) {
        return <div className="App"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="App"><p>Something went wrong: {error.message}</p></div>;
    }

    return (
        <div className="App">
            {/* <header className="App-header">
                {isLoggedIn ? (
                    <>
                        <p>Welcome, {displayName}!</p>
                        <button className="App-button" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <p>Please log in.</p>
                )}
            </header> */}
        </div>



    );
};

export default App;
