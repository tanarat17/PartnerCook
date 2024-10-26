import React, { useEffect, useState } from "react";
import { useLiff } from "react-liff";
import { useNavigate } from "react-router-dom";
import { loginWithLineId } from "./api/business/login";

const App = () => {
  const navigate = useNavigate();
  const { isLoggedIn, liff, error } = useLiff();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const liffidChanal = import.meta.env.VITE_LIFF_ID;

  // Load LIFF SDK dynamically
  const loadLiffSdk = () => {
    return new Promise((resolve, reject) => {
      if (window.liff) {
        resolve(window.liff);
      } else {
        const script = document.createElement("script");
        script.src = "https://static.line-scdn.net/liff/edge/2.1/sdk.js";
        script.onload = () => resolve(window.liff);
        script.onerror = () => reject(new Error("Failed to load LIFF SDK"));
        document.body.appendChild(script);
      }
    });
  };

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffSdk = await loadLiffSdk(); // Load the LIFF SDK
        await liffSdk.init({ liffId: liffidChanal });

        // Check if the user is logged in
        if (liffSdk.isLoggedIn()) {
          const profile = await liffSdk.getProfile();
          setDisplayName(profile.displayName);
          const response = await loginWithLineId(profile.userId);

          if (!response) {
            navigate("/Login");
          } else {
            const { jwt, user } = response;
                        localStorage.setItem('accessToken', jwt);
                        localStorage.setItem('user', JSON.stringify(user));
                        // console.log('Token and user data saved to localStorage');
                        navigate('/partner/shopHome');
          }
        } else {
          liffSdk.login();
        }
      } catch (err) {
        // console.error("Initialization or login error:", err);
        // setErrorMessage("Initialization or login error. Please try again.");
        window.location.reload(); // Reload หน้าเว็บ
      } finally {
        setLoading(false);
      }
      
    };

    initializeLiff();
  }, [liffidChanal, navigate]);

  const handleLogout = () => {
    if (liff) {
      liff.logout();
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login page
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="App">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <header className="App-header">
          <p>Welcome, {displayName}!</p>
          <button className="App-button" onClick={handleLogout}>Logout</button>
        </header>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default App;
