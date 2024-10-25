import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Header from "../../components/partner/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Button,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { getShopById, fetchShopInvoices } from "../../api/strapi/shopApi";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST;

function ShopHomeDetailPreSlip() {
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shop = await getShopById(token, userId);
        console.log("Full shop data response:", shop);

        if (shop && shop.shop && shop.shop.id) {
          const shopId = shop.shop.id;
          console.log("shopId:", shopId);

          const invoicesData = await fetchShopInvoices(shopId);
          console.log("Invoices data received:", invoicesData);

          if (
            invoicesData.data.attributes &&
            invoicesData.data.attributes.invoices &&
            Array.isArray(invoicesData.data.attributes.invoices.data)
          ) {
            setInvoices(invoicesData.data.attributes.invoices.data);
          } else {
            console.error(
              "No invoices found in the response or invoices is not an array"
            );
            setInvoices([]);
          }
        } else {
          console.error("Shop data structure is incorrect or missing");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (Array.isArray(invoices)) {
      const filtered = invoices.filter((invoice) =>
        invoice.attributes.invoiceNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      console.error("Invoices is not an array:", invoices);
    }
  }, [searchQuery, invoices]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Box sx={{ p: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TextField
              label="ค้นหาใบแจ้งหนี้..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                mb: 2,
                backgroundColor: "white",
              }}
            />

            <Grid container spacing={2}>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <Grid item xs={12} md={6} lg={4} key={invoice.id}>
                    <Card>
                      <CardHeader
                        title={`เลขที่ใบแจ้งหนี้: ${invoice.attributes.invoiceNumber}`}
                      />
                      <CardContent>
                        {/* แสดงชื่อจาก customer */}
                        {invoice.attributes.redeem &&
                          invoice.attributes.redeem.data &&
                          invoice.attributes.redeem.data.attributes.customer
                            .data && (
                            <Typography variant="body1">
                              ชื่อ:{" "}
                              {
                                invoice.attributes.redeem.data.attributes
                                  .customer.data.attributes.username
                              }
                            </Typography>
                          )}
                        {/* ใช้วันที่จาก redeem แทน */}
                        {invoice.attributes.redeem &&
                          invoice.attributes.redeem.data && (
                            <Typography variant="body1">
                              วันที่:{" "}
                              {new Date(
                                invoice.attributes.redeem.data.attributes.createdAt
                              ).toLocaleDateString("th-TH")}
                            </Typography>
                          )}

                        {/* เพิ่มส่วนการแสดงรูปภาพ */}
                        {invoice.attributes.transferImage &&
                          invoice.attributes.transferImage.data && (
                            <Box sx={{ mt: 2 }}>
                              <img
                                src={`${API_URL}${invoice.attributes.transferImage.data.attributes.url}`}
                                alt="Transfer Receipt"
                                style={{
                                  width: "100%",
                                  maxHeight: "200px",
                                  objectFit: "contain",
                                }}
                              />
                            </Box>
                          )}

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                          }}
                        >
                          {/* <Button variant="contained" color="warning">
                            ดูใบเสร็จ
                          </Button> */}
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: "#FBB615",
                              "&:hover": {
                                backgroundColor: "#f9a623",
                              },
                            }}
                            // startIcon={<FaRegSave />}
                            // onClick={handleSubmit}
                          >
                            ดูใบเสร็จ
                          </Button>
                          {invoice.attributes.status === "paid" ? (
                            <Button variant="contained" color="success">
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
                ))
              ) : (
                <Typography variant="body1">ไม่พบใบแจ้งหนี้</Typography>
              )}
            </Grid>
          </motion.div>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default ShopHomeDetailPreSlip;
