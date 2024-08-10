import Navbar from "./navbar";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkTokenExpiration() {
      const expirationTime = localStorage.getItem('tokenExpiration');
      if (expirationTime && new Date().getTime() > expirationTime) {
        localStorage.removeItem('profilePhoto');
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        navigate('/login');
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
