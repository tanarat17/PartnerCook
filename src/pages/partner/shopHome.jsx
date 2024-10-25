import Header from "../../components/partner/Header";
import { Link } from "react-router-dom";
import { getShopById } from "../../api/strapi/shopApi";
import { useState, useEffect } from "react";
import { Grid, TextField, Button, CircularProgress } from "@mui/material";

function PartnerHome() {
  const [shopData, setShopData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const token =
    localStorage.getItem("accessToken") || import.meta.env.VITE_TOKEN_TEST;
  const users = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = users.id;

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setIsLoading(true);
        const shopData = await getShopById(token, userId);

        if (shopData && typeof shopData === "object" && shopData.shop) {
          setShopData([shopData.shop]);
        } else {
          // กรณีไม่พบข้อมูลร้านค้า ให้เปลี่ยนไปหน้า ProfileStore
          // navigate('/PDPA');
        }
      } catch (error) {
        setFetchError("Error: Shop data is undefined or missing.");
        // navigate('/PDPA');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartnerData();
  }, [token, userId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (fetchError) return <p>{fetchError}</p>;

  return (
    <>
      <Header />
      <div className="mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {shopData.map((shop) => {
            const shopDetails = shop || {};

            return (
              <Link to={`/partner/add-product`} key={shop.id}>
                <div className="shop-2">
                  <span
                    className="circle"
                    style={{
                      backgroundImage: shop.image?.data?.attributes?.url
                        ? `url(${shop.image.data.attributes.url})`
                        : "url(https://cdn.britannica.com/70/234870-050-D4D024BB/Orange-colored-cat-yawns-displaying-teeth.jpg)",
                      backgroundSize: "cover",
                    }}
                  ></span>
                  <span className="pl-2">{shop.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default PartnerHome;
