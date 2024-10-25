// src\pages\partner\ShopHomeDetail.jsx
import Header from "../../components/partner/Header";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Grid, TextField, Button, CircularProgress } from "@mui/material";

import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner"; // นำเข้า QrScanner จาก react-qr-scanner

function ShopHomeDetail() {
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

  const navigate = useNavigate();
  const [result, setResult] = useState("No result");
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setIsScanning(false);

      try {
        // เข้าถึงเฉพาะค่า `text` จาก data
        let formattedData = data.text;

        // ทำการ clean escape characters
        if (typeof formattedData === "string") {
          // ทำการลบ escape characters และทำความสะอาดข้อมูล
          formattedData = formattedData
            .replace(/\\"/g, '"') // แทนที่ \\" ด้วย "
            .replace(/^"|"$/g, "") // ลบ " ที่อยู่ข้างหน้าและข้างหลังของข้อมูล
            .replace(/\\+/g, ""); // ลบ \ ทั้งหมด
          // ส่งข้อมูลแบบ string โดยไม่แปลงเป็น JSON
          navigate("/partner/ShopHomeDetailResive", {
            state: { rawData: formattedData },
          });
        } else {
          setResult("QR Code ไม่ใช่ JSON format");
        }
      } catch (error) {
        console.error("Error parsing QR code data:", error);
        setResult("ไม่สามารถอ่านข้อมูล QR Code ได้");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleClose = () => {
    console.log("Card closed");
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const cardStyle = {
    width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
    maxWidth: "550px",
    position: "relative",
  };

  const cardHeaderStyle = {
    backgroundColor: "#800020",
    color: "white",
  };

  const cardContentStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    height: "100vh",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const qrResultStyle = {
    marginTop: "10px",
  };

  const scanningOverlayStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(128, 0, 32, 0.8)",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
    zIndex: 1,
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            padding: "10px",
            marginTop: "10px",
            marginBottom: "10px",
            height: "100vh",
          }}
        >
          <Card
            sx={{
              width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
              maxWidth: "550px",
              position: "relative",
            }}
          >
            <CardHeader sx={{ backgroundColor: "#800020", color: "white" }} />
            <CardContent>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={previewStyle}
              />

              {isScanning && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(128, 0, 32, 0.8)",
                    color: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    textAlign: "center",
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h6">กำลัง Scan QR Code...</Typography>
                  <Typography variant="body2">
                    กรุณาอยู่ในพื้นที่ที่มีแสงสว่าง
                  </Typography>
                </div>
              )}

              <div className="qr-result" style={{ marginTop: "10px" }}>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.5rem", lineHeight: 1.5 }}
                >
                  {result}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Box>
      </>
    </ThemeProvider>
  );
}

export default ShopHomeDetail;
