import Header from "../../components/partner/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import { getProductByID } from "../../api/strapi/productApi";
import { getRedeemByUserId,updateRedeem, fetchRedeemData  , updateRedeemStatus  } from "../../api/strapi/RedeemApi";
import Swal from "sweetalert2";
import { getShopById } from "../../api/strapi/shopApi";


import "./css/Togle.css";
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

  const handleRedeem = async () => {
    if (productDetails && productDetails.length > 0) { 
      const productId = productDetails[0].id; // ใช้ productDetails แทน productData
      
      console.log("Handle Redeem Front : " + productId, shopId);
      try {
        // Fetch Redeem data ที่ตรงกับเงื่อนไข
        const redeemData = await fetchRedeemData(productId, shopId);
        
        if (redeemData && redeemData.data.length > 0) { // ตรวจสอบ redeemData
          const pendingRedeems = redeemData.data.filter(redeem => redeem.attributes.status === 'pending');
          
          if (pendingRedeems.length > 0) {
            const redeemId = pendingRedeems[0].id; 
            await updateRedeemStatus(redeemId); 
          } else {
            console.log('No pending redeem found.');
          }
        } else {
          console.log('No redeem data found.');
        }
      } catch (error) {
        console.error("Error handling redeem:", error);
      }
    } else {
      console.log('Product details not available');
    }
  };
// //Update Redeem Status
//   const handleSubmit = async () => {
//     try {
     
//       let response;
//       if (isEditing) {
//         response = await updateRedeem(token, Redeemid);
//         setProducts((prev) => prev.map((p) => (p.id === editProductId ? response.data.data : p)));
//       } else {
//         response = await addProduct(token, userLineId ,productData);
//         setProducts((prevProducts) => [...prevProducts, response.data.data]);
//         handleClose();
//       }

//       Swal.fire({
//         icon: "success",
//         title: isEditing ? "Update Statust Redeem แล้ว" : "Redeem Update เรียบร้อยแล้ว",
//         position: 'center',
//         showConfirmButton: true,
//         confirmButtonText: "ตกลง",
//       }).then(() => {
//         handleClose();
//         fetchProducts();
//       });
//     } catch (error) {
//       console.error("เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขRedeem:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขRedeem!",
//         position: 'center',
//         showConfirmButton: true,
//         confirmButtonText: "ตกลง",
//       }).then(() => {
//         handleClose(); // ปิด modal เมื่อมีข้อผิดพลาด
//       });
//     }
//   };

  {/* การคำนวณมูลค่ารวมทั้งหมด */}
const totalValues = Array.isArray(productDetails) ? productDetails.reduce((sum, product) => {
  const matchedItem = items.find(item => item.id === product.id);
  const count = matchedItem ? matchedItem.counts : 0; // ใช้ counts ถ้า match ได้
  const itemValue = (product.price || 0) * count; // คำนวณมูลค่ารวมของแต่ละรายการ
  return sum + itemValue; // รวมมูลค่าทั้งหมด
}, 0) : 0; // ถ้า productDetails ไม่ใช่ array ให้ totalValue เป็น 0


  

  const [toggledOn, setToggledOn] = useState(false); 
  const toggleSwitch = () => {
    setToggledOn(!toggledOn);
  };
  const handleClose = () => {
    console.log("Card closed");
  };


 // ฟังก์ชัน handleToggle
 const handleToggle = async (rowData) => {
  console.log("Redeem :", JSON.stringify(rowData, null, 2)); // ใช้ JSON.stringify เพื่อแสดงวัตถุในรูปแบบที่อ่านได้
  setIsToggled(prev => !prev);
  
  // ดึงข้อมูลการแลกของรางวัลเมื่อมีการเปิด toggle
  if (!isToggled) { 
    try {
      const reDeemId = rowData.id;
      const redeemData = await getRedeemByUserId(token, userId); // ส่ง rowData.id
      console.log("Redeem Data:", redeemData); 
      // คุณสามารถอัพเดตสถานะ หรือแสดงข้อมูลที่ได้จาก redeemData ที่นี่
    } catch (error) {
      console.error("Error fetching redeem data:", error);
    }
  }
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

                    <div>
      {/* ส่วนของ UI ที่ต้องการ */}
      <button onClick={handleRedeem}>Redeem</button>
      {loading && <p>Loading...</p>}
    </div>
                    
                  </TableRow>
                </TableHead>
                <TableBody>
  {Array.isArray(productDetails) && productDetails.length > 0 ? (
    productDetails.map((product, index) => {
      // หา count จาก items โดยการ match ด้วย product ID
      const matchedItem = items.find(item => item.id === product.id);
      const count = matchedItem ? matchedItem.counts : 0; // ใช้ counts ถ้า match ได้

      return (
        <TableRow key={index}>
          <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
            {product.name} {/* แสดงชื่อผลิตภัณฑ์ */}
          </TableCell>
          <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
            {count} {/* แสดงจำนวนสินค้าที่จับคู่ */}
          </TableCell>
          {/* <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
            {matchedItem ? matchedItem.numStock : 0} 
          </TableCell> */}
          <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
            {product.price !== undefined && product.price !== null && !isNaN(product.price)
              ? `${Number(product.price).toLocaleString()} บาท` // แสดงราคา
              : 'ไม่มีราคา'}
          </TableCell>


          <TableCell onClick={() => handleToggle(product)} sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px', cursor: 'pointer' }}>
            {product.name} {/* แสดงชื่อผลิตภัณฑ์ */}
          </TableCell>

          
        </TableRow>
      );
    })
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
          <div>
      {/* แสดงค่า shopId ที่เก็บไว้ */}
      {shopId && <p>Shop ID: {shopId}</p>}
      {/* แสดงข้อมูลอื่น ๆ ที่เกี่ยวข้อง */}
    </div>
    <div className="switch" onClick={() => { 
    toggleSwitch(); 
    handleRedeem();  // เรียกฟังก์ชัน handleRedeem
  }}>
  <motion.div
    className="handle"
    layout
    transition={{ type: "spring", stiffness: 700, damping: 30 }}
    style={{
      backgroundColor: toggledOn ? "#4CAF50" : "#ccc", // สีของ switch
      justifyContent: toggledOn ? "flex-end" : "flex-start", // เลื่อน handle
    }}
  >
    <ArrowForwardIcon style={{ fontSize: '40px', color: 'white' }} />
  </motion.div>
  <b>{toggledOn ? "เปิด" : "ปิด"}</b> {/* แสดงสถานะ */}
</div>

        </CardContent>
      </Card>
    </Box>
    </>
  );
}

export default ShopHomeDetailResive;
