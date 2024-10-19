import Header from "../../components/partner/Header";
import { Link } from "react-router-dom";
import { getShopById } from "../../api/strapi/shopApi";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function ShopHome() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('accessToken') || import.meta.env.VITE_TOKEN_TEST;
  const users = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = users.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const shopData = await getShopById(token, userId); 

        console.log('Fetched shop data:', shopData); 

        if (shopData && typeof shopData === 'object') {
          setShops([shopData]); 
        } else {
          navigate('/ProfileStore');
          setShops([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <div className="mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {shops.map((shop) => {
            const shopDetails = shop.shop || {}; // เข้าถึงรายละเอียดของ shop
            return (
              <Link to="/partner/add-product" className="btn-link" key={shop.id}>
                <div className="shop-2">
                  <span
                    className="circle block w-full h-100 md:h-100 lg:h-100 rounded-lg"
                    style={{
                      backgroundImage: shop.backgroundImage 
                        ? `url(${API_URL}${shop.backgroundImage})` 
                        : 'url(https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg)',
                      backgroundSize: "cover", 
                      backgroundPosition: "center", 
                      aspectRatio: '1 / 1' // ทำให้มีอัตราส่วน 1:1 เพื่อให้เป็นสี่เหลี่ยมจัตุรัส
                    }}
                  ></span>

                  <span className="pl-2 text-center block">{shopDetails.name || ''}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ShopHome;
