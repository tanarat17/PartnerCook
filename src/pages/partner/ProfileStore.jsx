// src/pages/partner/ProfileStore.jsx

import Header from "../../components/partner/Header";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import WebcamCapture from "../../components/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture2";
import {
  createShop,
  getBank,
  updateUserFromShop,
} from "../../api/strapi/shopApi";
import { uploadImage } from "../../api/strapi/uploadApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    checkedOne: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337"; // เปลี่ยนเป็น port ที่ถูกต้อง
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id; // ดึง user ID จากข้อมูลผู้ใช้ที่เก็บไว้
  const displayName = user.fullName; // ดึง displayName จากข้อมูลผู้ใช้ที่เก็บไว้
  const [banks, setBanks] = useState([]); // สำหรับเก็บข้อมูลธนาคาร
  const [loading, setLoading] = useState(true);



  console.log("ข้อมูลใน user:", JSON.stringify(user, null, 2));

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
        console.error("Error fetching banks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {}, [banks]);

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
      checkedOne,
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

      console.log(userData);
      console.log(userId);
      console.log(token);


      // อัปเดตข้อมูลผู้ใช้
      const responseUser = await updateUserFromShop(token, userId, userData);
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
        user: userId, // เชื่อมโยงกับ User
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
          text: "ลงทะเบียนร้านค้าเรียบร้อยแล้ว",
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/shopHome");
          }
        });
      } else {
        throw new Error("Shop registration failed.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        icon: "error",
        position: "center",
        text: error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    }
  };
  if (loading) {
    return <CircularProgress />;
  }
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
                inputProps={{
                  maxLength: 13, // จำกัดจำนวนหลักให้ไม่เกิน 13
                  pattern: "[0-9]*", // อนุญาตเฉพาะตัวเลข
                  inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนอุปกรณ์มือถือ
                }}
                error={formData.cardID.length !== 13} // แสดง error หากไม่ใช่ 13 หลัก
                helperText={
                  formData.cardID.length !== 13
                    ? "หมายเลขบัตรประจำตัวต้องมี 13 หลัก"
                    : ""
                }
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
                inputProps={{
                  maxLength: 15, // จำกัดให้กรอกไม่เกิน 15 หลัก
                  pattern: "[0-9]*", // อนุญาตให้กรอกเฉพาะตัวเลข
                  inputMode: "numeric", // แสดงคีย์บอร์ดตัวเลขบนมือถือ
                }}
                error={
                  formData.bookBankNumber.length > 15 ||
                  formData.bookBankNumber.length < 10
                } // แสดง error หากจำนวนหลักเกิน 15 หรือน้อยกว่า 10
                helperText={
                  formData.bookBankNumber.length > 15
                    ? "หมายเลขบัญชีธนาคารต้องไม่เกิน 15 หลัก"
                    : formData.bookBankNumber.length < 10
                    ? "หมายเลขบัญชีธนาคารต้องมีอย่างน้อย 10 หลัก"
                    : ""
                }
              />
            </div>

            <div className="w-full md:w-1/2 px-2 mt-4">
              <FormControl fullWidth>
                <InputLabel id="bank-select-label">ธนาคาร</InputLabel>
                <Select
                  className="bg-white"
                  labelId="bank-select-label"
                  id="bankChoose"
                  value={formData.bank}
                  label="ธนาคาร"
                  onChange={handleSelectChange}
                >
                  {/* Add all bank options here */}
                  <MenuItem value="3">
                    ธนาคารกรุงเทพ จำกัด (มหาชน) (Bangkok Bank Public Company
                    Limited)
                  </MenuItem>
                  <MenuItem value="4">
                    ธนาคารกรุงไทย จำกัด (มหาชน) (Krungthai Bank Public Company
                    Limited)
                  </MenuItem>
                  <MenuItem value="5">
                    ธนาคารกรุงศรีอยุธยา จำกัด (มหาชน) (Bank of Ayudhya Public
                    Company Limited - Krungsri)
                  </MenuItem>
                  <MenuItem value="6">
                    ธนาคารกสิกรไทย จำกัด (มหาชน) (Kasikornbank Public Company
                    Limited)
                  </MenuItem>
                  <MenuItem value="7">
                    ธนาคารซีไอเอ็มบี ไทย จำกัด (มหาชน) (CIMB Thai Bank Public
                    Company Limited)
                  </MenuItem>
                  <MenuItem value="8">
                    ธนาคารทหารไทยธนชาต จำกัด (มหาชน) (TMBThanachart Bank Public
                    Company Limited - TTB Bank)
                  </MenuItem>
                  <MenuItem value="9">
                    ธนาคารทิสโก้ จำกัด (มหาชน) (TISCO Bank Public Company
                    Limited)
                  </MenuItem>
                  <MenuItem value="10">
                    ธนาคารไทยเครดิต จำกัด (มหาชน) (Thai Credit Retail Bank
                    Public Company Limited)
                  </MenuItem>
                  <MenuItem value="11">
                    ธนาคารไทยพาณิชย์ จำกัด (มหาชน) (Siam Commercial Bank Public
                    Company Limited - SCB)
                  </MenuItem>
                  <MenuItem value="12">
                    ธนาคารยูโอบี จำกัด (มหาชน) (United Overseas Bank - Thai -
                    Public Company Limited - UOB)
                  </MenuItem>
                  <MenuItem value="13">
                    ธนาคารแลนด์ แอนด์ เฮ้าส์ จำกัด (มหาชน) (Land and Houses Bank
                    Public Company Limited)
                  </MenuItem>
                  <MenuItem value="14">
                    ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย) จำกัด (มหาชน) (Standard
                    Chartered Bank - Thai - Public Company Limited)
                  </MenuItem>
                  <MenuItem value="15">
                    ธนาคารไอซีบีซี (ไทย) จำกัด (มหาชน) (Industrial and
                    Commercial Bank of China - Thai - Public Company Limited -
                    ICBC)
                  </MenuItem>
                  <MenuItem value="16">
                    ธนาคารแห่งประเทศจีน (ไทย) จำกัด (มหาชน) (Bank of China -
                    Thai - Public Company Limited)
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* 3 Bangkok Bank Public Company Limited
            4 Krungthai Bank Public Company Limited
            5 Bank of Ayudhya Public Company Limited (Krungsri)
            6 Kasikornbank Public Company Limited
            7 CIMB Thai Bank Public Company Limited
            8 TMBThanachart Bank Public Company Limited (TTB Bank)
            9 TISCO Bank Public Company Limited
            10 Thai Credit Retail Bank Public Company Limited
            11 Siam Commercial Bank Public Company Limited (SCB)
            12 United Overseas Bank (Thai) Public Company Limited (UOB)
            13 Land and Houses Bank Public Company Limited
            14 Standard Chartered Bank (Thai) Public Company Limited
            15 Industrial and Commercial Bank of China (Thai) Public Company Limited (ICBC)
            16 Bank of China (Thai) Public Company Limited */}

            <div className="w-full px-2 mt-4">
              <div>
                <label style={{ color: "red" }}>* </label>{" "}
                ถ่ายรูปตนเองพร้อมถือบัตรประจำตัวประชาชน
              </div>
              <WebcamCapture
                className="bg-white"
                id="image"
                onCapture={handleCaptureimage}
                ModuleName="IDCard"
              />
            </div>
            <div className="w-full px-2 mt-4">
              <label style={{ color: "red" }}>* </label> ถ่ายหน้าบุ๊คแบงก์
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

        <div className="container mx-auto px-4 mt-10 mb-5">
          <Checkbox
            id="checkedOne"
            checked={formData.checkedOne}
            onChange={handleInputChange}
            required
            sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }}
          />
         <span className="pb-14">
         <strong style={{ color: 'red', marginRight: '10px' }}>กุ๊ก</strong>ให้ความสำคัญเกี่ยวกับความปลอดภัยข้อมูลของคุณ{" "}
            <span className="text-justify leading-loose">
              และเพื่อให้คุณมั่นใจว่า
              กุ๊กมีความมุ่งมั่นที่จะให้ความคุ้มครองและดำเนินการด้วยความรับผิดชอบต่อการเก็บรวบรวม
              ใช้ เปิดเผย และโอนข้อมูลของคุณ กุ๊กจึงขอความยินยอมจากคุณ
            </span>
          </span>
        </div>

        <div className="container mx-auto px-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white ${
              isFormValid ? "bg-[#FBB615]" : "bg-slate-300"
            }`}
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </ThemeProvider>
  );
}
