import Header from "../../components/partner/Header";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import "./css/Togle.css";

function ShopHomeDetailPreSlip() {
  const location = useLocation(); 
  const { customerRelation, totalPoints, status, invoice, productJsonArray, shop, date, time } = location.state || {}; 

  // ตรวจสอบว่ามี productJsonArray 
  const [items, setItems] = useState(productJsonArray || []); 
  
  // คำนวณมูลค่ารวม
  const totalValue = items.reduce((sum, item) => {
    const itemValue = Number(item.value) || 0; // แปลงเป็นตัวเลข
    return sum + (itemValue * item.quantity); 
  }, 0);
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
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                    {item.productId}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'left', fontFamily: 'Sarabun, sans-serif', fontSize: '14px' }}>
                    {item.value !== undefined && item.value !== null && !isNaN(item.value)
                      ? `${Number(item.value).toLocaleString()} บาท`
                      : 'ไม่มีราคา'}
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default ShopHomeDetailPreSlip;
