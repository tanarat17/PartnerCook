import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../style.css";
import { IconButton, Box, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useLiff } from "react-liff";
import Swal from "sweetalert2";
import LogoutIcon from "@mui/icons-material/Logout";
import { getShopById } from "../../api/strapi/shopApi";
import { Link } from "react-router-dom";

const Header = () => {
  const [shopData, setShopData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const token =
    localStorage.getItem("accessToken") || import.meta.env.VITE_TOKEN_TEST;
  const users = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = users.id;

  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, liff } = useLiff(); // ใช้ LIFF เพื่อตรวจสอบสถานะการล็อกอิน

  useEffect(() => {
    // ตรวจสอบสถานะการล็อกอินและตั้งค่าชื่อผู้ใช้
    const checkLoginStatus = async () => {
      if (liff && liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        setDisplayName(profile.displayName); // ตั้งค่าชื่อผู้ใช้
      }
    };
    checkLoginStatus();
  }, [liff]);

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

  // ฟังก์ชันสลับเมนูแสดง/ซ่อน
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // ฟังก์ชันจัดการการ Logout
  const handleLogout = () => {
    if (liff) {
      liff.logout(); // ทำการ logout ผ่าน LIFF
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Swal.fire({
      icon: "success",
      title: "ออกจากระบบสำเร็จ!",
      showConfirmButton: true,
    }).then(() => {
      navigate("/"); // นำผู้ใช้กลับไปหน้า Login หลัง logout
    });
  };
  return (
    <>
      <nav className="flex items-center justify-between p-2 pr-5 bg-white">
        <NavLink
          to="/partner/shopHome"
          style={{ color: "#000000", textDecoration: "none" }}
        >
          <img src={logo} alt="Logo" width={50} />
        </NavLink>

        <div className="flex items-center">
          {isLoggedIn && <div className="flex items-center"></div>}
          <IconButton onClick={toggleMenu}>
            <MenuIcon className="hover:text-yellow-hard" />{" "}
            {/* แสดงไอคอนเมนู */}
          </IconButton>
        </div>
      </nav>
      {menuOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: "60%",
            bgcolor: "white",
            boxShadow: 3,
            zIndex: 1000,
            transition: "transform 0.3s ease",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <Box p={2}>
            {/* ปุ่มปิดเมนู */}
            <IconButton onClick={toggleMenu} sx={{ color: "#000000" }}>
              <ArrowForwardIosIcon />
            </IconButton>
            <NavLink
              to="/partner/ProfileStoreEdit"
              style={{ color: "#000000", textDecoration: "none" }}
            >
              ข้อมูลร้านค้า
            </NavLink>
            {/* เนื้อหาหรือเมนูอื่นๆ */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {shopData.map((shop) => {
                const shopDetails = shop || {};

                return (
                  <Link to={`/partner/ProfileStoreEdit`} key={shop.id}>
                    <div className="shop-3">
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
            {/* ปุ่ม Logout ที่อยู่ล่างสุด */}
            {isLoggedIn && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  left: 0,
                  right: 0,
                  margin: "auto",
                  p: 1,
                  bgcolor: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  fullWidth
                  sx={{ maxWidth: "300px" }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Header;
