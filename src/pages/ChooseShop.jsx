import Header from "../components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/Group.png";
import "../components/style.css";
import { BsBasket2 } from "react-icons/bs";
import { BsCoin } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { getAllProductsByShopId } from "../api/strapi/productApi";
import { CartContext } from '../components/CartContext';

export default function ChooseShop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const [counts, setCounts] = useState(() => {
  //   const storedCounts = localStorage.getItem('cart');
  //   return storedCounts ? JSON.parse(storedCounts) : {};
  // });
  const [counts, setCounts] = useState(() => {
    const isRefreshed = true; // ใช้เงื่อนไขนี้สำหรับการเช็คว่ามีการรีเฟรชหรือไม่
    if (isRefreshed) {
      // รีเซ็ตค่า counts เป็น 0 หรือ object ว่างเปล่า
      localStorage.removeItem('cart');
      return {};
    } else {
      // ดึงค่าจาก localStorage ถ้ามีการบันทึกไว้
      const storedCounts = localStorage.getItem('cart');
      return storedCounts ? JSON.parse(storedCounts) : {};
    }
  });
  const token = import.meta.env.VITE_TOKEN_TEST;
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addToCart, removeFromCart } = useContext(CartContext); // Access addToCart and removeFromCart

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const ProductData = await getAllProductsByShopId(token, id);
        setProducts(ProductData);
        setLoading(false);

        if (ProductData.length === 0) {
          alert("No product for this shop");
          navigate("/home");
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, token, navigate]);

  const updateCart = (productId, quantity) => {
    console.log("productId: ", productId, "quantity: ", quantity);
    console.log("counts in update: ", counts);
    const updatedCounts = { ...counts, [productId]: (counts[productId] || 0) + quantity };
    setCounts(updatedCounts);
    localStorage.setItem('cart', JSON.stringify(updatedCounts));
    console.log("updatedCounts in update: ", updatedCounts);
  };
  // const handleIncrement = (product) => {
  //   // Use only updateCart to manage the count, no need to call addToCart if it also updates
  //   updateCart(product.id, 1);
  // };

  // const handleDecrement = (productId) => {
  //   if (counts[productId] > 0) {
  //     // Use only updateCart to manage the count, no need to call removeFromCart if it also updates
  //     updateCart(productId, -1);
  //   }
  // };
  const handleIncrement = (product) => {
  console.log("In CountsById[", product.id, "] : ", product);
    addToCart(product);
    updateCart(product.id, 1);
  };

  const handleDecrement = (productId) => {
  console.log("De CountsById[", productId, "] : ", counts[productId]);
    if (counts[productId] > 0) {
      removeFromCart(productId);
      updateCart(productId, -1);
    }
  };
  // console.log("CountsById[", product.id, "] : ", counts[products.id]);
  console.log("products: ", products);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      {/* <Header counts={counts} products={products}/> */}
      <Container maxWidth="sm">
        {products.length > 0 && <p className="text-3xl text-center pt-10">{products[0]?.shop?.name}</p>}
        {products.map(product => (
          <div key={product.id}>
            <div className="w-full h-60 bg-white mt-10 rounded-s-md">
              <div className="flex justify-center">
                <span
                  className="circle"
                  style={{
                    backgroundImage: product.image?.data?.attributes?.url
                      ? `url(${API_URL}${product.image.data.attributes.url})`
                      : 'url(https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg)',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    maxWidth: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                ></span>
              </div>
              <div className="flex flex-row">
                <button
                  className="basis-1/4 rounded-bl-md bg-red-hard-bg text-white font-bold text-3xl pb-3 width-button-inandde"
                  style={{ height: '2.9rem' }}
                  onClick={() => handleDecrement(product.id)}>
                  -
                </button>
                <button
                  className="basis-1/2 col-start-2 col-span-4 bg-yellow-hard-bg font-bold width-button-count"
                  style={{ height: '2.9rem' }}>
                  {counts[product.id] || 0}
                </button>
                <button
                  className="basis-1/4 bg-green-hard-bg text-white font-bold text-3xl pb-3 rounded-br-md width-button-inandde"
                  style={{ height: '2.9rem' }}
                  onClick={() => handleIncrement(product)}>
                  +
                </button>
              </div>
            </div>
            <p className="text-center text-2xl mt-10">{product.name}</p>
            <p className="text-center text-2xl mt-3 pb-10">{product.point || 0} แต้ม</p>
          </div>
        ))}
      </Container>
    </>
  );
}
