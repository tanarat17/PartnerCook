import Header from "../../components/partner/Header";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, Button } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import WebcamCapture from "../../components/WebcamCapture";
import WebcamCapture2 from "../../components/WebcamCapture2";
import { createShop,getBank ,getShopById } from "../../api/strapi/shopApi";
import { uploadImage } from "../../api/strapi/uploadApi";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ProfileStoreEdit() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banks, setBanks] = useState([]); // สำหรับเก็บข้อมูลธนาคาร
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    
    name: '',
    fullName: '',
    cardID: '',
    bookBankNumber: '',
    bank: '',
    location: '',
    checkedOne: false
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('accessToken') || import.meta.env.VITE_TOKEN_TEST;
  const users = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = users.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const shopData = await getShopById(token, userId); // เรียก API

        console.log('Fetched shop data:', shopData); // แสดงข้อมูลที่ได้รับจาก API

        if (shopData && typeof shopData === 'object') {
          setShops([shopData]); // ตั้งค่า shops ด้วยข้อมูลที่ได้รับ
          // อัปเดตค่าฟอร์มด้วยข้อมูลที่ได้รับ
          setFormData({
            name: shopData.shop.name || '',
            fullName: shopData.fullName || '',
            cardID: shopData.cardID || '',
            bookBankNumber: shopData.shop.bookBankNumber || '',
            bank: shopData.shop.bank || '',
            location: shopData.shop.location || '',
            image: shopData.shop.image || '',
            bookBankImage: shopData.shop.bookBankImage || '',

            checkedOne: false // กำหนดค่าตั้งต้นของ checkbox
          });
        } else {
          navigate('/ProfileStore');
          setShops([]); // หาก shopData ไม่ถูกต้อง ให้ตั้งค่าเป็นอาเรย์ว่าง
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [token, userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSelectChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      checkedOne: checked
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


  const handleSubmit = (e) => {
    e.preventDefault();
    // ที่นี่จะมีฟังก์ชันในการบันทึกข้อมูล
    console.log('Form submitted:', formData);
  };

  if (loading) return <p>Loading...</p>;
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

        <div className="container mx-auto px-4 mt-10 mb-5">
          <Checkbox
            id="checkedOne"
            checked={formData.checkedOne}
            onChange={handleCheckboxChange}
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
            className={`w-full h-12 mb-10 flex justify-center rounded-xl items-center text-white ${formData.name && formData.fullName && formData.cardID && formData.bookBankNumber && formData.bank && formData.location ? "bg-green-500" : "bg-slate-300"}`}
          >
            บันทึกข้อมูล
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfileStoreEdit;
