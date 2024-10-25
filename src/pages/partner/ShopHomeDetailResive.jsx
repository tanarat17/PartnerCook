import Header from "../../components/partner/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { getProductByID } from "../../api/strapi/productApi";
import Swal from "sweetalert2";
import { getShopById, fetchShopRedeem } from "../../api/strapi/shopApi";

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
  const [loading, setLoading] = useState(false);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [shops, setShops] = useState([]);

  const [parsedItems, setParsedItems] = useState([]);
  const [redeems, setRedeems] = useState([]);
  const [redeem, setRedeem] = useState([]);

  const [isLoading, setIsLoading] = useState([]);

  // ดึงข้อมูลสินค้าที่ถูก redeem
  useEffect(() => {
    const fetchData = async () => {
      console.log("Row Data From Scan: " + rawData);
      if (rawData) {
        try {
          const cleanData = rawData.replace(/^"|"$/g, "").trim();
          const parsedItems = JSON.parse(cleanData);
          setParsedItems(parsedItems); // เพิ่มการตั้งค่า parsedItems
          setItems(parsedItems);
          console.log("Parsed Items from Scan: ", parsedItems);

          if (parsedItems.length > 0) {
            const uniqueProducts = new Set();
            const newProductDetails = [];

            for (const item of parsedItems) {
              const productId = item.id;
              if (!uniqueProducts.has(productId)) {
                uniqueProducts.add(productId);
                const productData = await getProductByID(
                  token,
                  userLineId,
                  productId
                );
                if (productData) {
                  newProductDetails.push(productData);
                }
              }
            }
            setProductDetails(newProductDetails);
          }
        } catch (error) {
          console.error("Error parsing rawData:", error);
        }
      }
    };

    fetchData();
  }, [rawData, token, userLineId]);

  useEffect(() => {
    const fetchRedeems = async () => {
      setIsLoading(true);
      try {
        const shopData = await getShopById(token, userId);
        console.log("Shop Data Front Redeem: ", shopData);

        if (shopData && shopData.shop && shopData.shop.redeems) {
          setRedeems(shopData.shop.redeems);
          console.log("Redeems: ", shopData.shop.redeems);
        } else {
          console.log("No redeems available.");
        }
      } catch (error) {
        console.error("Error fetching redeems: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedeems();
  }, [token, userId]);

  useEffect(() => {
    const compareData = () => {
      if (productDetails.length > 0 && rawData) {
        // Clean and parse rawData
        const cleanData = rawData.replace(/^"|"$/g, "").trim();
        const parsedItems = JSON.parse(cleanData);

        console.log("Parsed Items from Scan: ", parsedItems);
        console.log("Product Details: ", productDetails);

        const matchingProducts = parsedItems.filter((item) =>
          productDetails.some((product) => product.id === item.id)
        );

        console.log("Matching Products: ", matchingProducts);

        if (matchingProducts.length > 0) {
          console.log("Match");

          if (redeems && Array.isArray(redeems)) {
            const validRedeems = redeems.filter(
              (redeem) => redeem.status === "pending" && redeem.productJsonArray
            );

            validRedeems.forEach((redeem) => {
              try {
                // Clean productJsonArray
                const productJsonString = redeem.productJsonArray
                  .replace(/\\\"/g, '"')
                  .replace(/\\\\/g, "\\")
                  .replace(/(^"|"$)/g, "");

                const productJsonArray = JSON.parse(productJsonString);

                if (Array.isArray(productJsonArray)) {
                  matchingProducts.forEach((matchedItem) => {
                    // ตรวจสอบว่ามีการตรงกันมากกว่า 3 จุด
                    const matchCount = productJsonArray.filter((product) => {
                      return (
                        product.id === matchedItem.id &&
                        product.name === matchedItem.name &&
                        product.counts === matchedItem.counts &&
                        product.point === matchedItem.point &&
                        product.numStock === matchedItem.numStock
                      );
                    }).length;

                    if (matchCount > 0) {
                      console.log("Redeem Details: ", redeem);
                    }
                  });
                } else {
                  console.error(
                    "productJsonArray is not an array:",
                    productJsonArray
                  );
                }
              } catch (error) {
                console.error(
                  "Error parsing productJsonArray for redeem:",
                  redeem,
                  error
                );
              }
            });
          } else {
            console.error("Redeems is not defined or not an array:", redeems);
          }
        } else {
          console.log("Not Match");
        }
      }
    };

    compareData();
  }, [productDetails, rawData, redeems]);

  // คำนวณมูลค่ารวมของสินค้า
  const totalValues = Array.isArray(productDetails)
    ? productDetails.reduce((sum, product) => {
        const matchedItem = items.find((item) => item.id === product.id);
        const count = matchedItem ? matchedItem.counts : 0;
        const itemValue = (product.price || 0) * count;
        return sum + itemValue;
      }, 0)
    : 0;

  // ฟังก์ชัน Toggle
  const handleToggle = () => {
    setIsToggled((prev) => !prev);
    console.log("Toggle switch state:", !isToggled);
  };

  const handleClose = () => {
    console.log("Card closed");
  };

  return (
    <>
      <Header />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "40vh", marginBottom: "30px" }}
      >
        <Card style={{ width: "80%", maxWidth: "800px" }}>
          <CardHeader
            style={{ backgroundColor: "#800020", color: "white" }}
            action={
              <IconButton onClick={handleClose} style={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                marginBottom: "16px",
                fontFamily: "Sarabun",
              }}
            >
              {/* ลูกค้า: {customerRelation}, คะแนน: {totalPoints}, สถานะ: {status} */}
            </Typography>
            <TableContainer sx={{ marginBottom: "24px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        fontFamily: "Sarabun, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      รายการสินค้า
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        fontFamily: "Sarabun, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      จำนวน
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "left",
                        fontFamily: "Sarabun, sans-serif",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      มูลค่า (บาท)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(productDetails) &&
                  productDetails.length > 0 ? (
                    productDetails.map((product, index) => {
                      const matchedItem = items.find(
                        (item) => item.id === product.id
                      );
                      const count = matchedItem ? matchedItem.counts : 0;

                      return (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              textAlign: "left",
                              fontFamily: "Sarabun, sans-serif",
                              fontSize: "12px",
                            }}
                          >
                            {product.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              fontFamily: "Sarabun, sans-serif",
                              fontSize: "12px",
                            }}
                          >
                            {count}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "left",
                              fontFamily: "Sarabun, sans-serif",
                              fontSize: "12px",
                            }}
                          >
                            {product.price
                              ? `${Number(product.price).toLocaleString()} บาท`
                              : "ไม่มีราคา"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                        ไม่มีข้อมูลผลิตภัณฑ์
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                marginBottom: "16px",
                fontFamily: "Sarabun",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              รวมเป็นมูลค่า : {totalValues.toFixed(2)} บาท
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "20vh" }}
      >
        <Card style={{ width: "80%", maxWidth: "800px" }}>
          <CardHeader
            style={{ backgroundColor: "#800020", color: "white" }}
            action={
              <IconButton onClick={handleClose} style={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            }
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              padding: "16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Sarabun, sans-serif",
                fontSize: "18px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              ยืนยันการจัดส่งสินค้า
            </Typography>

            {/* Switch Component */}
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ marginRight: "10px" }}>
                <Box
                  sx={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: isToggled ? "green" : "red",
                    marginRight: "10px",
                  }}
                />
                <Typography variant="body1">{isToggled ? "" : ""}</Typography>
              </Typography>
              <motion.div
                onClick={handleToggle}
                style={{
                  width: 200, // เพิ่มความยาวของ switch
                  height: 25,
                  borderRadius: 12,
                  background: isToggled ? "#FFC300" : "#ccc",
                  position: "relative",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    position: "absolute",
                    top: 2,
                    left: isToggled ? 175 : 5, // ปรับตำแหน่งให้เข้ากับความยาวใหม่
                    transition: "left 0.2s",
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
