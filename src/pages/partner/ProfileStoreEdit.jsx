import Header from "../../components/partner/Header";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  CircularProgress,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import WebcamCapture from "../../components/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture2";
import {
  updateUserFromShop,
  getBank,
  getShopById,
} from "../../api/strapi/shopApi";
import { uploadImage } from "../../api/strapi/uploadApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function ProfileStoreEdit() {
  const BANK_OPTIONS = {
    3: "Bangkok Bank Public Company Limited",
    4: "Krungthai Bank Public Company Limited",
    5: "Bank of Ayudhya Public Company Limited - Krungsri",
    6: "Kasikornbank Public Company Limited",
    7: "CIMB Thai Bank Public Company Limited",
    8: "TMBThanachart Bank Public Company Limited - TTB Bank",
    9: "TISCO Bank Public Company Limited",
    10: "Thai Credit Retail Bank Public Company Limited",
    11: "Siam Commercial Bank Public Company Limited - SCB",
    12: "United Overseas Bank - Thai - Public Company Limited - UOB",
    13: "Land and Houses Bank Public Company Limited",
    14: "Standard Chartered Bank - Thai - Public Company Limited",
    15: "Industrial and Commercial Bank of China - Thai - Public Company Limited - ICBC",
    16: "Bank of China - Thai - Public Company Limited",
  };

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState([]); // สำหรับเก็บข้อมูลธนาคาร
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    cardID: "",
    bookBankNumber: "",
    bank: "",
    location: "",
    checkedOne: false,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token =
  localStorage.getItem("accessToken") || import.meta.env.VITE_TOKEN_TEST;
  const users = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = users.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const shopData = await getShopById(token, userId);
        if (shopData && typeof shopData === "object") {
          setShops([shopData]);
      
          setFormData({
            name: shopData.shop.name || "",
            fullName: shopData.fullName || "",
            cardID: shopData.cardID || "",
            bookBankNumber: shopData.shop.bookBankNumber || "",
            bank: BANK_OPTIONS[shopData.shop.bank.id] || "",
            location: shopData.shop.location || "",
            image: shopData.shop.image || "",
            bookBankImage: shopData.shop.bookBankImage || "",

            checkedOne: true, 
          });
        } else {
          // navigate("/ProfileStore");
          setShops([]);
        }
      } catch (error) {
       
        Swal.fire({
          icon: 'warning',
          text: 'กรุณาลงทะเบียนร้านค้า',
          confirmButtonText: 'ตกลง',
      }).then((result) => {
          if (result.isConfirmed) {
              navigate('/partner/PDPA');
          }
      });
      
    }finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      checkedOne: checked,
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

  const handleCaptureBookBankImage = (imageFile) => {
    if (imageFile) {
      setFormData((prevData) => ({
        ...prevData,
        bookBankImage: imageFile,
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await Swal.fire({
        text: "ต้องการบันทึกข้อมูลใช่หรือไม่ ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "บันทึก",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const response = await updateUserFromShop(token, userId, formData);
        await Swal.fire({
          text: "ทำการแก้ไขข้อมูลร้านค้าเรียบร้อยแล้ว",
          icon: "success",
        });
        navigate("/shopHome");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการส่งข้อมูล:", error);
      await Swal.fire({
        icon: "error",
        text: "เกิดข้อผิดพลาดในการส่งข้อมูล!",
      });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <>
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

            {/* <div className="w-full md:w-1/2 px-2 mt-4">
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
                        {bank.name} 
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>  */}

            <div className="w-full md:w-1/2 px-2 mt-4">
              <FormControl fullWidth>
                <InputLabel id="bank-select-label">ธนาคาร</InputLabel>
                <Select
                  className="bg-white"
                  labelId="bank-select-label"
                  id="bank"
                  value={formData.bank} // Display the bank name here
                  label="ธนาคาร"
                  onChange={handleSelectChange}
                >
                  {/* Loop through BANK_OPTIONS to generate MenuItems */}
                  {Object.entries(BANK_OPTIONS).map(([id, name]) => (
                    <MenuItem key={id} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="w-full px-2 mt-4">
              <div>
                <label style={{ color: "red" }}>* </label>{" "}
                ถ่ายรูปตนเองพร้อมถือบัตรประจำตัวประชาชน
              </div>
              <div className="mt-4 border-2 border-gray-300 p-4 rounded-md">
                <WebcamCapture
                  className="bg-white"
                  id="image"
                  onCapture={handleCaptureimage}
                  ModuleName="IDCard"
                />
                <div className="w-full px-2 mt-4">
                  {formData.image && (
                    <div className="mt-4 border-2 border-gray-300 p-4 rounded-md">
                      <img
                        src={`${API_URL}${formData.image.url}`}
                        alt="IDCardIMG"
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          height: "auto",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full px-2 mt-4">
              <div>
                <label style={{ color: "red" }}>* </label> ถ่ายหน้าบุ๊คแบงก์
              </div>
              <div className="mt-4 border-2 border-gray-300 p-4 rounded-md">
                <WebcamCapture
                  className="bg-white"
                  id="bookBankImage"
                  onCapture={handleCaptureBookBankImage}
                  ModuleName="BookBank"
                />
                <div className="w-full px-2 mt-4">
                  {formData.bookBankImage && (
                    <div className="mt-4 border-2 border-gray-300 p-4 rounded-md">
                      <img
                        src={`${API_URL}${formData.bookBankImage.url}`}
                        alt="BookBankIMG"
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          height: "auto",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
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
            onChange={handleCheckboxChange}
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
            className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white ${
              formData.name &&
              formData.fullName &&
              formData.cardID &&
              formData.bookBankNumber &&
              formData.bank &&
              formData.location
                ? "bg-[#FBB615]"
                : "bg-slate-300"
            }`}
          >
            แก้ไขข้อมูล
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfileStoreEdit;
