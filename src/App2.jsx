import React, { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import axios from 'axios';

import './App.css';

const App = () => {
  const [displayName, setDisplayName] = useState('');
  const { error, isLoggedIn, isReady, liff } = useLiff();
  // const [error2, setError2] = useState('');
  // const [loading, setLoading] = useState(false);
  // const token = import.meta.env.VITE_TOKEN_TEST ;
  // const apiKey = import.meta.env.VITE_API_KEY ;
  const apiKey = 'https://cookbstaging.careervio.com';
console.log("apiKey", apiKey);

  useEffect(() => {
    // if (!isLoggedIn) return;

    (async () => {
      console.log("aaaa");
      // await liff.init({ liffId: '2006277696-kQM0MMde' });
      const profile = await liff.getProfile();
      console.log(profile);
      var lineId = profile.userId;
      var username = "cook" + lineId ;
      var password = "cookcook";
      var email = "cook" + lineId + "@cook.com";
      try {
        const response = await axios.post(`${apiKey}/api/auth/local`, {
          "identifier":username, // this can be email, username, or lineId based on your Strapi setup
          "password" : password,
        });

        // try {
        //   const response = await axios.get(`${apiKey}/api/redeems/${itemId}`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   });

        //   // Handle successful retrieval
        //   setItemClaim(response.data);
        // } catch (err) {
        //   // Handle error
        //   console.error('Error fetching item claim:', err);
        //   setError('Failed to fetch the item claim.');
        // } finally {
        //   setLoading(false);
        // }

        // You can store the JWT token in localStorage or handle it as needed
        localStorage.setItem('token', response.data.jwt);
        console.log('Login successful:', response.data);
        console.log('App2 login jwt: ', response.data.jwt);
      } catch (err) {
        // Handle login error
        console.error('Login error:', err);
        setError2('Invalid credentials, please try again.');
        // Order register to server
          try {
            const response = await axios.post(`${apiKey}/api/auth/local/register`, {
              username,
              email,
              password,
            });

            // You can store the JWT token in localStorage or handle it as needed
            localStorage.setItem('token', response.data.jwt);
            // Handle successful registration
            console.log('Registration successful:', response.data);
            console.log('App2 regis jwt: ', response.data.jwt);
          } catch (err) {
            // Handle registration error
            console.error('Registration error:', err);
            setError2('Registration failed, please try again.');
          } finally {
            setLoading(false);
          }
      } finally {
        setLoading(false);
      }
      setDisplayName(profile.displayName);
    })();
  }, [liff, isLoggedIn]);

  const showDisplayName = () => {
    if (error) return <p>Something is wrong.</p>;
    if (!isReady) return <p>Loading...</p>;

    if (!isLoggedIn) {
      return (
        <button className="App-button" onClick={liff.login}>
          Login
        </button>
      );
    }
    return (
      <>
        <p>Welcome to the react-liff demo app, {displayName}!</p>
        <button className="App-button" onClick={liff.logout}>
          Logout
        </button>
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">{showDisplayName()}</header>
    </div>
  );
};

export default App;
