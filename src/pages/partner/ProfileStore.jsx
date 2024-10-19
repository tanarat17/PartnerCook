// src/pages/partner/ProfileStore.jsx

import Header from "../../components/partner/Header";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField, FormControl, InputLabel, MenuItem, Select, Checkbox } from "@mui/material";
import WebcamCapture from "../../components/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture2";
import { createShop,getBank,updateUserFromShop } from "../../api/strapi/shopApi";
import { uploadImage } from "../../api/strapi/uploadApi";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function ProfileStore() {
  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    location: "",
    cardID: "",
    bookBankNumber: "",
    bank: "",
    image: "",
    bookBankImage: "",
    checkedOne: false
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:1337'; // เปลี่ยนเป็น port ที่ถูกต้อง
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id; // ดึง user ID จากข้อมูลผู้ใช้ที่เก็บไว้
  const displayName = user.fullName; // ดึง displayName จากข้อมูลผู้ใช้ที่เก็บไว้
  const [banks, setBanks] = useState([]); // สำหรับเก็บข้อมูลธนาคาร
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id || name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCaptureimage = (imageFile) => {
    if (imageFile) {
      setFormData((prevData) => ({
        ...prevData,
        image: imageFile,
      }));
    }
  };

useEffect(() => {
  const fetchBanks = async () => {
    try {
      const response = await getBank(token);
      setBanks(response); 
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false); 
    }
  };

  fetchBanks();
}, []);

useEffect(() => {
}, [banks]);

  const handleCaptureBookBankImage = (imageFile) => {
    if (imageFile) {
      setFormData((prevData) => ({
        ...prevData,
        bookBankImage: imageFile,
      }));
    }
  };

  const handleSelectChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      bank: event.target.value,
    }));
  };

  // Validate form data
  useEffect(() => {
    const {
      name,
      fullName,
      location,
      cardID,
      bookBankNumber,
      bank,
      image,
      bookBankImage,
      checkedOne
    } = formData;

    setIsFormValid(
      name &&
      fullName &&
      location &&
      cardID &&
      bookBankNumber &&
      bank &&
      image &&
      bookBankImage &&
      checkedOne
    );
  }, [formData]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    let uploadedImageObject = null;
    let uploadedBookBankImageObject = null;

    try {
        // ตรวจสอบและอัปโหลดรูปภาพ (ถ้ามี)
        if (formData.image) {
            const uploadResponse = await uploadImage(formData.image);
            uploadedImageObject = uploadResponse.id; // ใช้ id ของรูปภาพที่อัปโหลดสำเร็จ
        }

        if (formData.bookBankImage) {
            const uploadResponse = await uploadImage(formData.bookBankImage);
            uploadedBookBankImageObject = uploadResponse.id;
        }

        // เตรียมข้อมูลผู้ใช้สำหรับการอัปเดต
        const userData = {
            fullName: formData.fullName,
            cardID: formData.cardID,
            address: formData.location,
        };

        // อัปเดตข้อมูลผู้ใช้
        console.log("Sending user data:", userData);
        const responseUser = await updateUserFromShop(token, userId, userData);
        console.log("Response from updateUserFromShop:", responseUser);
        if (!responseUser || responseUser.error) {
          console.error("Error updating user:", responseUser);
      }

        // เตรียมข้อมูลร้านค้า
        const shopData = {
            name: formData.name,
            location: formData.location,
            latitude: formData.latitude, // เพิ่มฟิลด์ latitude
            longitude: formData.longitude, // เพิ่มฟิลด์ longitude
            image: uploadedImageObject,
            bookBankNumber: formData.bookBankNumber,
            bookBankImage: uploadedBookBankImageObject,
            bank: formData.bank,
            user: userId,  // เชื่อมโยงกับ User
            // products: formData.products, // ถ้ามีการส่ง product IDs มาให้
            checkedOne: formData.checkedOne,
        };

        // สร้างร้านค้าใหม่
        const response = await createShop(token, shopData);

        if (response) {
            // แสดงผลสำเร็จ
            Swal.fire({
                position: "center",
                icon: "success",
                title: "ลงทะเบียนร้านค้าเรียบร้อย",
                showConfirmButton: true,
                confirmButtonText: "ตกลง"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/shopHome");
                }
            });
        } else {
            throw new Error('Shop registration failed.');
        }

    } catch (error) {
        console.error("Error during submission:", error);
        Swal.fire({
            icon: "error",
            title: "พบข้อผิดพลาดระหว่างลงทะเบียน",
            position: 'center',
            text: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", // ปรับให้แสดงข้อความของ error ที่เกิดขึ้น
            confirmButtonText: "ตกลง"
        });
    }
};


  return (
    <ThemeProvider theme={theme}>
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <TextField
                id="name"
                label="ชื่อร้านค้า"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mt-4 md:mt-0">
              <TextField
                id="fullName"
                label="ชื่อ-นามสกุล"
                type="text"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="cardID"
                label="หมายเลขบัตรประจำตัวประชาชน"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.cardID}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="bookBankNumber"
                label="หมายเลขบัญชีธนาคาร"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.bookBankNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="w-full md:w-1/2 px-2 mt-4">
              <FormControl fullWidth>
                <InputLabel id="bank-select-label">ธนาคาร</InputLabel>
                <Select
                  className="bg-white"
                  labelId="bank-select-label"
                  id="bank"
                  value={formData.bank}
                  label="ธนาคาร"
                  onChange={handleSelectChange}
                >
                  {loading ? (
                    <MenuItem disabled>กำลังโหลดข้อมูล...</MenuItem>
                  ) : (
                    banks.map((bank) => (
                      <MenuItem key={bank.id} value={bank.id}>
                        {bank.name} {/* แสดงชื่อธนาคาร */}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>
            
            <div className="w-full px-2 mt-4">
              <div>
                <label>ถ่ายรูปตนเองพร้อมถือบัตรประจำตัวประชาชน</label>
              </div>
              <WebcamCapture 
                className="bg-white" 
                id="image" 
                onCapture={handleCaptureimage} 
                ModuleName="IDCard"
              />
            </div>

            <div className="w-full px-2 mt-4">
              <label>ถ่ายหน้าบุ๊คแบงก์</label>
              <WebcamCapture2 
                className="bg-white" 
                id="bookBankImage" 
                onCapture={handleCaptureBookBankImage} 
                ModuleName="BookBank"
              />

            </div>
            <div className="w-full px-2 mt-4">
              <TextField
                label="ที่อยู่"
                placeholder="ที่อยู่"
                id="location"
                multiline
                minRows={3}
                maxRows={10}
                fullWidth
                className="w-full bg-white"
                required
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* <div className="container mx-auto px-4 mt-10 mb-5">
          <h3>Debugging Information</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <p>Is Form Valid: {isFormValid ? "Yes" : "No"}</p>
        </div> */}

        <div className="container mx-auto px-4 mt-10 mb-5">
          <Checkbox
            id="checkedOne"
            checked={formData.checkedOne}
            onChange={handleInputChange}
            required
            sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
          />
          <span>
            <strong>ยอมรับเงื่อนไข</strong>{" "}
          </span>
        </div>
       
        <div className="container mx-auto px-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white ${
              isFormValid ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </ThemeProvider>
  );
}
