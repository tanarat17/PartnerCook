import Header from "../../../components/partner/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { getProductByID } from "../../../api/strapi/productApi";
import "./css/Togle.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST;
const user = JSON.parse(localStorage.getItem("user") || "{}");

const userId = user.id;
const userLineId = user.lineId;

function ShopHomeDetailResive() {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const rawData = location.state?.rawData; // รับข้อมูล rawData
  const [items, setItems] = useState([]);
  const [productDetails, setProductDetails] = useState([]); // State สำหรับเก็บรายละเอียดสินค้า

  useEffect(() => {
    if (rawData) {
      try {
        const cleanData = rawData.replace(/^"|"$/g, '').trim();
        const parsedItems = JSON.parse(cleanData);
        setItems(parsedItems);
  
        if (parsedItems.length > 0) {
          const fetchProductDetails = async () => {
            const uniqueProducts = new Set(); // Set สำหรับเก็บ ID ของผลิตภัณฑ์ที่ไม่ซ้ำ
            const newProductDetails = []; // ตัวแปรใหม่สำหรับเก็บรายละเอียดผลิตภัณฑ์
  
            for (const item of parsedItems) {
              const productId = item.id; 
              const count = item.counts; // ใช้ counts จาก item
  
              if (!uniqueProducts.has(productId)) {
                uniqueProducts.add(productId);
                const productData = await getProductByID(token, userLineId, productId);
                
                if (productData) { // ตรวจสอบว่า productData ไม่เป็น null หรือ undefined
                  // รวมข้อมูล productData และ count เข้าไปใน newProductDetails
                  newProductDetails.push({ 
                    ...productData.attributes, // ดึง attributes ของ productData 
                    counts: count // เพิ่ม counts ลงในข้อมูลผลิตภัณฑ์
                  });
                }
              }
            }
  
            setProductDetails(newProductDetails); // อัปเดต state productDetails ทีเดียวหลังจาก loop เสร็จ
          };
  
          fetchProductDetails();
        }
      } catch (error) {
        console.error("Error parsing rawData:", error);
      }
    }
  }, [rawData, token, userLineId]);
  
  console.log("ROW : " , rawData);

  const totalValue = Array.isArray(items) ? items.reduce((sum, item) => {
    const itemValue = Number(item.value) || 0; // ถ้า item.value เป็น null หรือ undefined ให้เป็น 0
    const itemQuantity = Number(item.quantity) || 0; // ถ้า item.quantity เป็น null หรือ undefined ให้เป็น 0
    return sum + (itemValue * itemQuantity); 
  }, 0) : 0; // ถ้า items ไม่ใช่ array ให้ totalValue เป็น 0
  

  const [toggledOn, setToggledOn] = useState(false); 
  const toggleSwitch = () => {
    setToggledOn(!toggledOn);
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
              <IconButton onClick={handleClose} style={{ color: 'white' }}>
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
                    productDetails.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                          {product.name} {/* ตรวจสอบว่าใช้ product.name และไม่ใช่ item.name */}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                          {product.count} {/* แสดงจำนวนจาก row data */}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                          {product.counts} {/* เพิ่มการแสดงผลของ counts */}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                          {product.price !== undefined && product.price !== null && !isNaN(product.price)
                            ? `${Number(product.price).toLocaleString()} บาท`
                            : 'ไม่มีราคา'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center' }}>
                        ไม่มีข้อมูลผลิตภัณฑ์
                      </TableCell>
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
              รวมเป็นมูลค่า : {totalValue.toFixed(2)} บาท
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
              minHeight: '200px'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: 'Sarabun, sans-serif', 
                fontSize: '18px',
                textAlign: 'center',
                padding: '40px',
              }}
            >
              ยืนยันการจัดส่งสินค้า
            </Typography>

            <div className="switch" data-Option={toggledOn} onClick={toggleSwitch}>
              <motion.div className="handle" layout transition={{ type: "spring", stiffness: 700, damping: 30 }}>
                <ArrowForwardIcon style={{ fontSize: '40px', color: 'white' }} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ShopHomeDetailResive;
