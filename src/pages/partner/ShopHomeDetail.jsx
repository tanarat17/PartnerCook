import Header from "../../components/partner/Header";
import { QrReader } from 'react-qr-reader';
import { useState } from "react";
import { Box, Card, CardContent, CardHeader, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function ShopHomeDetail() {
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

  const navigate = useNavigate(); // ใช้สำหรับการนำทาง
  const [result, setResult] = useState('No result');
  const [delay, setDelay] = useState(100);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setIsScanning(false);

      try {
        const parsedData = JSON.parse(data);

        // ส่งข้อมูลที่สแกนไปยังหน้า ShopHomeDetailResive
        navigate('/partner/ShopHomeDetailResive', { state: parsedData });

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

  return (
    <ThemeProvider theme={theme}>
      <>
        <Header />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          sx={{ padding: '5px', marginTop: '10px', marginBottom: '10px', height: '100vh' }} 
        >
          <Card 
            sx={{ 
              width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
              maxWidth: '550px', 
              position: 'relative' 
            }}
          >
            <CardHeader 
              sx={{ backgroundColor: '#800020', color: 'white' }}
              action={
                <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              }
            />
            <CardContent>
              <QrReader
                delay={delay}
                onError={handleError}
                onResult={handleScan}
                onLoad={() => setIsScanning(true)} 
                sx={{ width: '100%', height: 'auto' }} 
              />
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(128, 0, 32, 0.8)', 
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  zIndex: 1,
                }}>
                  <Typography variant="h6">กำลัง Scan QR Code...</Typography>
                  <Typography variant="body2">กรุณาอยู่ในพื้นที่ที่มีแสงสว่าง</Typography>
                </div>
              )}

              <div className="qr-result" style={{ marginTop: '10px' }}>
                <Typography variant="body1" sx={{ fontSize: '1.5rem', lineHeight: 1.5 }}>
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
