import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Header from "../../components/partner/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Box, Card, CardContent, CardHeader, IconButton, Typography, Button, Grid, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from "framer-motion";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ShopHomeDetailPreSlip() {

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: "P0001",
      customerName: "Christian Walton",
      date: "7 สิงหาคม 2567 เวลา 18:35 น.",
      status: "paid",
    },
    {
      id: 2,
      invoiceNumber: "P0002",
      customerName: "เด็กหอม",
      date: "8 สิงหาคม 2567 เวลา 19:00 น.",
      status: "unpaid",
    }
  ]);

  const [searchQuery, setSearchQuery] = useState(""); // สถานะสำหรับเก็บคำค้นหา

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // ฟังก์ชันกรองรายการที่ค้นหา
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const theme = createTheme({
  //   typography: {
  //     fontFamily: "Sarabun !important",
  //   },
  // });

  return (
    
        <ThemeProvider theme={theme}>

      <Header />
      <Box sx={{ p: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ช่องค้นหา */}
          <TextField
            label="ค้นหาใบแจ้งหนี้..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange} // เมื่อเปลี่ยนค่าค้นหา
            sx={{ 
              mb: 2,  // เพิ่มระยะห่างจากขอบล่าง
              backgroundColor: 'white' // พื้นหลังสีขาว
            }}
          />


          <Grid container spacing={2}>
            {filteredInvoices.map((invoice) => (
              <Grid item xs={12} md={6} lg={4} key={invoice.id}>
                <Card>
                  <CardHeader
                    action={
                      <IconButton aria-label="close">
                        <CloseIcon />
                      </IconButton>
                    }
                    title={`เลขที่ใบแจ้งหนี้: ${invoice.invoiceNumber}`}
                  />
                  <CardContent>
                    <Typography variant="body1">
                      ชื่อ: {invoice.customerName}
                    </Typography>
                    <Typography variant="body1">
                      วันที่: {invoice.date}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button variant="contained" color="warning">
                        ดูใบเสร็จ
                      </Button>
                      {invoice.status === "paid" ? (
                        <Button variant="contained" color="success" >
                          ชำระเงินแล้ว
                        </Button>
                      ) : (
                        <Button variant="outlined" color="error">
                          ค้างชำระ
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
      </ThemeProvider>

  );
}

export default ShopHomeDetailPreSlip;
