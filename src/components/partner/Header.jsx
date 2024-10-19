import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../style.css";
import { IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false); 

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // เปลี่ยนสถานะเมนู
    };

    return (
        <>
            <nav className="flex items-center justify-between p-2 pr-5 bg-white">
                <NavLink 
                        to="/partner/shopHome" 
                        style={{ color: "#000000", textDecoration: 'none' }}
                    >
                                       <img src={logo} alt="Logo" width={50} />

                    </NavLink>
                {/* <img src={logo} alt="Logo" width={50} /> */}
                <IconButton onClick={toggleMenu}>
                    <MenuIcon className="hover:text-yellow-hard" /> {/* แสดงไอคอนสามขีด */}
                </IconButton>
            </nav>
            {/* เมนูที่ซ่อนอยู่ */}
            {menuOpen && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        height: "100%",
                        width: "60%",
                        bgcolor: "white",
                        boxShadow: 2,
                        zIndex: 1000,
                        transition: "transform 0.3s ease",
                        transform: menuOpen ? "translateX(0)" : "translateX(100%)",
                    }}
                >
                  <Box p={2}>
                    <IconButton onClick={toggleMenu} sx={{ color: "#000000" }}> 
                        <ArrowForwardIosIcon /> 
                    </IconButton>
                    <NavLink 
                        to="/partner/ProfileStoreEdit" 
                        style={{ color: "#000000", textDecoration: 'none' }}
                    >
                        ข้อมูลร้านค้า
                    </NavLink>
                </Box>

                </Box>
            )}
        </>
    );
}

export default Header;
