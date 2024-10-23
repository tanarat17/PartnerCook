import Header from "../../components/partner/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { getProductByID } from "../../api/strapi/productApi";
import { getRedeemByUserId, getRedeemByShop } from "../../api/strapi/RedeemApi";
import Swal from "sweetalert2";
import { getShopById } from "../../api/strapi/shopApi";

import "./css/Togle.css"; // ไฟล์ CSS สำหรับ switch

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST;
const user = JSON.parse(localStorage.getItem("user") || "{}");

const userId = user.id;
const userLineId = user.lineId;

function ShopHomeDetailResive() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const rawData = location.state?.rawData; 
  const [items, setItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]); 
  const [isToggled, setIsToggled] = useState(false);
  const [shops, setShops] = useState([]); 
  const [shopId, setShopId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [isOn, setIsOn] = useState(false);

  // ดึงข้อมูลสินค้าที่ถูก redeem
  useEffect(() => {
    if (rawData) {
      try {
        const cleanData = rawData.replace(/^"|"$/g, '').trim();
        const parsedItems = JSON.parse(cleanData);
        setItems(parsedItems);
        
        if (parsedItems.length > 0) {
          const fetchProductDetails = async () => {
            const uniqueProducts = new Set(); 
            const newProductDetails = []; 

            for (const item of parsedItems) {
              const productId = item.id; 
              if (!uniqueProducts.has(productId)) {
                uniqueProducts.add(productId);
                const productData = await getProductByID(token, userLineId, productId);
                if (productData) { 
                  newProductDetails.push(productData); 
                }
              }
            }
            setProductDetails(newProductDetails); 
          };

          fetchProductDetails();
          fetchShops();
        }
      } catch (error) {
        console.error("Error parsing rawData:", error);
      }
    }
  }, [rawData, token, userLineId]);

  // ดึงข้อมูลร้านค้า
  const fetchShops = async () => {
    try {
      setLoading(true);
      const shopData = await getShopById(token, userId); 
      console.log('Fetched shop data:', shopData); 

      if (shopData && typeof shopData === 'object') {
        setShops([shopData]); 
        setShopId(shopData.id); 
      } else {
        navigate('/ProfileStore');
        setShops([]); 
        setShopId(null);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการ Redeem
  const handleRedeem = async () => {
    console.log("Handle Redeem Front : " + shopId);
    try {
      const shopRedeemData = await getRedeemByShop(shopId);
      
      if (shopRedeemData && shopRedeemData.length > 0) {
        const pendingRedeems = shopRedeemData.filter(redeem => redeem.attributes.status === 'pending');
        if (pendingRedeems.length > 0) {
          console.log('Pending Redeems:', pendingRedeems);
        } else {
          console.log('No pending redeem found in shop.');
        }
      } else {
        console.log('No redeem data found for this shop.');
      }
    } catch (error) {
      console.error("Error handling redeem:", error);
    }
  };

  // คำนวณมูลค่ารวมของสินค้า
  const totalValues = Array.isArray(productDetails) ? productDetails.reduce((sum, product) => {
    const matchedItem = items.find(item => item.id === product.id);
    const count = matchedItem ? matchedItem.counts : 0;
    const itemValue = (product.price || 0) * count;
    return sum + itemValue;
  }, 0) : 0;

  // ฟังก์ชัน Toggle
  const handleToggle = () => {
    setIsToggled(prev => !prev);
    console.log("Toggle switch state:", !isToggled);
  };

  const handleClose = () => {
    console.log("Card closed");
  };

  return (
    <>
      <Header />
      <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '40vh', marginBottom: '30px' }}>
        <Card style={{ width: '80%', maxWidth: '800px' }}>
          <CardHeader 
            style={{ backgroundColor: '#800020', color: 'white' }}
            action={
              <IconButton onClick={() => console.log("Card closed")} style={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '16px', fontFamily: 'Sarabun' }}>
              {/* ลูกค้า: {customerRelation}, คะแนน: {totalPoints}, สถานะ: {status} */}
            </Typography>
            <TableContainer sx={{ marginBottom: '24px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '16px' }}>
                      รายการสินค้า
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '16px' }}>
                      จำนวน
                    </TableCell>
                    <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '16px' }}>
                      มูลค่า (บาท)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(productDetails) && productDetails.length > 0 ? (
                    productDetails.map((product, index) => {
                      const matchedItem = items.find(item => item.id === product.id);
                      const count = matchedItem ? matchedItem.counts : 0;

                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                            {product.name}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                            {count}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                            {product.price ? `${Number(product.price).toLocaleString()} บาท` : 'ไม่มีราคา'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>ไม่มีข้อมูลผลิตภัณฑ์</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography 
              variant="h7" 
              sx={{ 
                fontFamily: 'Sarabun, sans-serif', 
                fontWeight: 'bold', 
                marginTop: '24px',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              รวมเป็นมูลค่า : {totalValues.toFixed(2)} บาท
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Card สำหรับยืนยันการส่งสินค้า */}
      <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '20vh' }}>
        <Card style={{ width: '80%', maxWidth: '800px' }}>
          <CardHeader
            style={{ backgroundColor: '#800020', color: 'white' }}
            action={
              <IconButton onClick={handleClose} style={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px',
              padding: '16px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Sarabun, sans-serif',
                fontSize: '18px',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              ยืนยันการจัดส่งสินค้า
            </Typography>

            {/* Switch Component */}
            <Box display="flex" alignItems="center">
  <Typography variant="body1" sx={{ marginRight: '10px' }}>
    {isToggled ? "" : ""}
  </Typography>
  <motion.div
    onClick={handleToggle}
    style={{
      width: 400, // เพิ่มความยาวของ switch
      height: 25,
      borderRadius: 12,
      background: isToggled ? '#FFC300' : '#ccc',
      position: 'relative',
      cursor: 'pointer',
    }}
    whileHover={{ scale: 1.1 }}
  >
    <motion.div
      style={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: 'white',
        position: 'absolute',
        top: 2,
        left: isToggled ? 375 : 5, // ปรับตำแหน่งให้เข้ากับความยาวใหม่
        transition: 'left 0.2s',
      }}
    />
  </motion.div>
</Box>

          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ShopHomeDetailResive;
