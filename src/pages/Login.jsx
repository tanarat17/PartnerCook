import { useEffect, useState } from 'react';
import { useLiff } from 'react-liff';
import { loginWithLineId } from '../api/business/login';
import { createUser, getUser } from '../api/strapi/userApi';
import { useNavigate } from 'react-router-dom';
import Header from "../components/partner/Header";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Swal from 'sweetalert2';
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const Login = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });

  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [telNumber, setTelNumber] = useState('');
  const [address, setAddress] = useState('');
  const [cardID, setCardID] = useState('');

  const [gender, setGender] = useState(''); // สถานะเพศ
  const [genderError, setGenderError] = useState(false); // สถานะการแสดงข้อความผิดพลาดเพศ


  const [errorMessage, setErrorMessage] = useState('');
  const { isReady, liff } = useLiff();
  const navigate = useNavigate();
  const liffidChanal = import.meta.env.VITE_LIFF_ID;

  useEffect(() => {
    const initializeLiff = async () => {
        try {
            await liff.init({ liffId: liffidChanal });
            const profile = await liff.getProfile();
            setProfile(profile); // เก็บโปรไฟล์ผู้ใช้ที่ดึงมา
        } catch (error) {
            console.error('Error initializing LIFF:', error);
            setErrorMessage('Failed to initialize. Please try again.');
        }
    };

    if (isReady) {
        initializeLiff();
    }
}, [isReady, liff]);


const handleRegister = async (e) => {
  e.preventDefault();
  console.log('Register button clicked');

  // ตรวจสอบว่า profile มีค่าหรือไม่
  if (!profile) {
      setErrorMessage('Profile is not available. Please log in again.');
      return;
  }

  // ตรวจสอบค่า gender
  if (!gender) {
      setGenderError(true);
      return;
  } else {
      setGenderError(false);
  }

  // ตรวจสอบหมายเลขโทรศัพท์
  if (telNumber.length !== 10 || !telNumber.startsWith('0')) {
      setErrorMessage('หมายเลขโทรศัพท์ต้องมี 10 หลักและขึ้นต้นด้วย 0');
      return;
  } else {
      setErrorMessage('');
  }

  try {
      const registerResponse = await createUser({
          username: `cook${profile.userId}`,
          email: `cook${profile.userId}@cook.com`,
          password: 'cookcook',
          lineId: profile.userId,
          userType: 'shop',
          fullName: profile.displayName,
          telNumber: telNumber,
          gender: gender,
          address: address,
          cardID: cardID,
      });

      console.log('Registration response:', registerResponse);

      // แสดง SweetAlert
      await Swal.fire({
         
          text: 'คุณได้ลงทะเบียนเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ไปที่หน้าจอ PDPA'
      });

     
      navigate('/partner/PDPA'); 

  } catch (error) {
      setErrorMessage('Registration failed. Please try again.');
      console.error('Registration error:', error);
  }
};



  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="form-container max-w-md mx-auto mt-10 p-5 border rounded shadow">

  <label className="block text-lg font-medium mb-4 mt-4">ข้อมูลการลงทะเบียนเพิ่มเติม</label>
            <form onSubmit={handleRegister} className="registration-form">


            <div className="form-group mb-4">
        <FormControl fullWidth variant="outlined" error={genderError}>
          <InputLabel id="gender-select-label">เพศ</InputLabel>
          <Select
            labelId="gender-select-label"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="bg-white"
            required
          >
            <MenuItem value="Male">ชาย</MenuItem>
            <MenuItem value="Female">หญิง</MenuItem>
            <MenuItem value="Other">อื่นๆ</MenuItem>
          </Select>
          {genderError && <FormHelperText>กรุณาระบุเพศ</FormHelperText>} {/* ข้อความผิดพลาด */}
        </FormControl>
      </div>


          <div className="form-group mb-4">
            <TextField
              id="telNumber"
              label="หมายเลขโทรศัพท์"
              variant="outlined"
              fullWidth
              required
              value={telNumber}
              onChange={(e) => setTelNumber(e.target.value)}
              placeholder="กรุณากรอกหมายเลขโทรศัพท์"
              className="bg-white"
              inputProps={{
                maxLength: 10, // จำกัดจำนวนหลักให้ไม่เกิน 10
                pattern: "0[0-9]{9}", // อนุญาตเฉพาะหมายเลขโทรศัพท์ที่ขึ้นต้นด้วย 0 และมี 10 หลัก
                inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนอุปกรณ์มือถือ
              }}
              error={telNumber.length !== 10 || !telNumber.startsWith('0')} // แสดง error หากไม่เป็นไปตามเงื่อนไข
              helperText={
                telNumber.length !== 10 || !telNumber.startsWith('0')
                  ? "หมายเลขโทรศัพท์ต้องมี 10 หลักและขึ้นต้นด้วย 0"
                  : ""
              }
            />
          </div>

          <div className="form-group mb-4">
            <TextField
              id="address"
              label="ที่อยู่"
              variant="outlined"
              fullWidth
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="กรุณากรอกที่อยู่"
              className="bg-white"
              multiline // เปลี่ยนเป็น TextArea
              rows={4} // กำหนดจำนวนแถวเริ่มต้น
            />
          </div>


            <div className="form-group mb-4">
              <TextField
                id="cardID"
                label="หมายเลขบัตรประชาชน"
                variant="outlined"
                fullWidth
                required
                value={cardID}
                onChange={(e) => setCardID(e.target.value)}
                placeholder="กรุณากรอกหมายเลขบัตรประชาชน"
                className="bg-white"
                inputProps={{
                  maxLength: 13,
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
                error={cardID.length !== 13}
                helperText={cardID.length !== 13 ? "หมายเลขบัตรประชาชนต้องมี 13 หลัก" : ""}
              />
            </div>

           

                      <button 
            type="submit" 
            className="submit-button text-white p-2 rounded hover:bg-slate-300" 
            style={{ backgroundColor: '#FBB615' }}
          >
            ลงทะเบียน
          </button>
          </form>

          {errorMessage && <p className="error text-red-500 mt-2">{errorMessage}</p>}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;
