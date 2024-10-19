import { NavLink } from "react-router-dom";
import logo from "../assets/images/Group.png";
import "./style.css";
import React, { useState, useEffect, useContext } from "react";
import { BsBasket2 } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { getUser } from "../api/strapi/userApi"; // Import getUser function
import { CartContext } from "./CartContext"; // Import CartContext for cart items
import { useNavigate } from 'react-router-dom';

function Header() {
  // function Header() {

  const storedCounts = localStorage.getItem('cart');
  let totalItems = 0;

  if (storedCounts) {
    const counts = JSON.parse(storedCounts); // Parse the JSON string into an object
    totalItems = Object.values(counts).reduce((acc, count) => acc + count, 0);
  }

  const userId = import.meta.env.VITE_USER_ID;
  const token = import.meta.env.VITE_TOKEN_TEST;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems } = useContext(CartContext); // Access cart items from CartContext
  // console.log("cartItems in header: ", cartItems);
  const [clicked, setClicked] = useState(false); // For mobile menu toggle
  console.log("cartItems in header: ", cartItems);
  const navigate = useNavigate();
  const handleBasketClick = () => {
    // Navigate to the CartSummary route
    navigate('/cart', { state: { storedCounts, cartItems } });
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId, token);
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  // Handle mobile menu toggle
  const handleClick = () => {
    setClicked((prevState) => !prevState);
  };

  // Loading and Error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <nav className="flex items-center justify-between p-5 pr-20 bg-white">
        <NavLink to="/">
          <img src={logo} alt="Logo" width={50} />
        </NavLink>

        {/* Basket Icon and Count */}
          <div className="flex items-center relative">
            <BsBasket2 className="w-10 h-10 text-green-700 ml-10" onClick={handleBasketClick}/>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>


        {/* Coin Icon and Balance */}
        <NavLink to={`/history-point/${user?.id}`} >
          <div className="flex flex-col items-center">
            <BsCoin className="w-7 h-7 text-yellow-hard ml-8" />
            <p className="ml-6 mt-2">
              <strong>{user?.point ?? 0}</strong>
            </p>
          </div>
        </NavLink>

        <div>
          <ul id="navbar" className={clicked ? "navbar open" : "navbar"}>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to="/update-user-profile"
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                ข้อมูลส่วนตัว/ลงทะเบียน
              </NavLink>
            </li>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to={`/history-point/${user?.id}`}
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                คะแนนสะสมและประวัติการแลกแต้ม
              </NavLink>
            </li>
            <li>
              <NavLink
                className="font-semibold hover:text-yellow-hard"
                to={`/history-service-machine/${user?.id}`}
                style={({ isActive }) => {
                  return { color: isActive ? "yellow-hard" : "" };
                }}
              >
                ประวัติการใช้บริการตู้
              </NavLink>
            </li>
          </ul>
        </div>

        <div id="mobile" onClick={handleClick}>
          <i id="bar" className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
      </nav>
    </>
  );
}

export default Header;
