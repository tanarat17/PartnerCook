// src/pages/Login.jsx

import React, { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import { useNavigate } from 'react-router-dom';
import { loginWithLineId } from '../api/business/login';
import { createUser, getUser } from '../api/strapi/userApi';

const Login = () => {
  const navigate = useNavigate();
  const { isReady, liff, error } = useLiff();
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        console.log("LIFF initialized successfully.");

        if (liff.isLoggedIn()) {
          const token = liff.getAccessToken();
          setAccessToken(token);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          const profileData = await fetchLineProfile(token);
          setUserData(profileData);

          const response = await handleLineLogin(profileData);
          if (response) {
            navigate('/partner/shopHome');
          } else {
            navigate('/partner/PDPA');
          }
        } else {
          liff.login();
        }
      } catch (err) {
        console.error('Initialization or login error:', err);
        setErrorMessage('Initialization or login error. Please try again.');
      }
    };

    if (isReady) {
      initializeLiff();
    }
  }, [isReady, liff, navigate]);

  const handleLineLogin = async (profileData) => {
    try {
      const existingUser = await getUser(profileData.userId, accessToken);
      if (!existingUser) {
        const createUserResponse = await createUser(profileData);
        return createUserResponse;
      }
      return existingUser;
    } catch (error) {
      console.log('User not found, proceeding to register.');
      return null;
    }
  };

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {profile && <p>Welcome, {profile.displayName}!</p>}
    </div>
  );
};

export default Login;