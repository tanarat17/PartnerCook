import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../style.css";
import { IconButton, Box ,Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLiff } from 'react-liff';
import Swal from 'sweetalert2';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');
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

    // ฟังก์ชันสลับเมนูแสดง/ซ่อน
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // ฟังก์ชันจัดการการ Logout
    const handleLogout = () => {
        if (liff) {
            liff.logout(); // ทำการ logout ผ่าน LIFF
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        Swal.fire({
            icon: 'success',
            title: 'ออกจากระบบสำเร็จ!',
            showConfirmButton: true,
        }).then(() => {
            navigate('/'); // นำผู้ใช้กลับไปหน้า Login หลัง logout
        });
    };

    return (
        <>
            <nav className="flex items-center justify-between p-2 pr-5 bg-white">
                <NavLink to="/partner/shopHome" style={{ color: "#000000", textDecoration: 'none' }}>
                    <img src={logo} alt="Logo" width={50} />
                </NavLink>
                
                <div className="flex items-center">
                    {isLoggedIn && (
                        <div className="flex items-center">
                        </div>
                    )}
                    <IconButton onClick={toggleMenu}>
                        <MenuIcon className="hover:text-yellow-hard" /> {/* แสดงไอคอนเมนู */}
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
                        width: "30%",
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

                        {/* เนื้อหาหรือเมนูอื่นๆ */}
                        {/* ปุ่ม Logout ที่อยู่ล่างสุด */}
                        {isLoggedIn && (
                            <Box 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    width: '100%', 
                                    p: 2, 
                                    bgcolor: "white", 
                                    display: 'flex', 
                                    justifyContent: 'center' 
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="error" // สีแดง
                                    startIcon={<LogoutIcon />} // เพิ่มไอคอนก่อนข้อความ
                                    onClick={handleLogout} 
                                    fullWidth // ทำให้ปุ่มยาวเต็มความกว้าง
                                    sx={{ maxWidth: '300px' }} // กำหนดความกว้างสูงสุด (ถ้าต้องการให้ปุ่มไม่ยาวเกินไป)
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



