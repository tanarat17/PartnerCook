// src/pages/partner/AddProduct.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/partner/Header";
import { FaPlus, FaRegSave } from "react-icons/fa";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import WebcamCapture from "../../components/WebcamCapture";
import onion from "../../assets/images/onion.png";
import { Grid, TextField } from "@mui/material";
import Swal from "sweetalert2";
import {
  addProduct,
  getAllProductsByShopId,
  updateProduct,
} from "../../api/strapi/productApi";
import { uploadImage } from "../../api/strapi/uploadApi";
import { getShopById } from "../../api/strapi/shopApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user.id;

export default function AddProduct() {
  const [open, setOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopId, setShopId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    numStock: "",
    type: "",
    price: "",
    description: "",
    image: null,
  });


  const fetchShops = async () => {
    try {
      const shopData = await getShopById(token, userId);
      if (shopData && typeof shopData === "object") {
        setShopId(shopData.shop.id);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [token, userId]);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getAllProductsByShopId(token, shopId);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:", error);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchProducts();
    }
  }, [shopId, token]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({
      ...form,
      [id]: value,
    });
  };

  const handleCaptureimage = (file) => {
    if (file) {
      setForm((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
    else {
      // แจ้งเตือนเมื่อไม่เลือกภาพ
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเลือกภาพ',
        text: 'กรุณาเพิ่มรูปสินค้าก่อนทำการบันทึก',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.numStock || !form.price || !form.type) {
        Swal.fire({
          icon: "warning",
          title: "ข้อมูลไม่ครบ",
          text: "กรุณาตรวจสอบข้อมูลอีกครั้ง",
          position: 'center',
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
        });
        return;
      }

      if (form.numStock < 0 || form.price < 0) {
        Swal.fire({
          icon: "warning",
          title: "ค่าติดลบไม่ถูกต้อง",
          text: "จำนวนและมูลค่าต้องเป็นค่าบวก",
          position: 'center',
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
        });
        return;
      }

      let imageId = null;
      if (form.image) {
        const uploadResponse = await uploadImage(form.image);
        console.log("Uploaded Image:", uploadResponse);
        imageId = uploadResponse.id;
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        numStock: parseFloat(form.numStock),
        type: form.type,
        shop: shopId,
        image: imageId,
        approved: false,
      };

      let response;
      if (isEditing) {
        response = await updateProduct(token, editProductId, productData);
        setProducts((prev) => prev.map((p) => (p.id === editProductId ? response.data.data : p)));
      } else {
        response = await addProduct(token, productData);
        setProducts((prevProducts) => [...prevProducts, response.data.data]);
        handleClose();
      }

      Swal.fire({
        icon: "success",
        title: isEditing ? "สินค้าถูกแก้ไขเรียบร้อยแล้ว" : "สินค้าถูกเพิ่มเรียบร้อยแล้ว",
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      }).then(() => {
        handleClose();
        fetchProducts();
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขสินค้า:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดข้อผิดพลาดในการเพิ่ม/แก้ไขสินค้า!",
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      }).then(() => {
        handleClose(); // ปิด modal เมื่อมีข้อผิดพลาด
      });
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProductId(product.id);
    setForm({
      name: product.name,
      numStock: product.numStock,
      type: product.type,
      price: product.price,
      description: product.description,
      image: null,
    });
    setOpen(true);
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setForm({
      name: "",
      numStock: "",
      type: "",
      price: "",
      description: "",
      image: null,
    });
  };

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun !important",
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <Container maxWidth="sm">
          <div className="flex flex-row">
            <div className="basis-6/12"></div>
            <div
              onClick={handleOpen}
              className="basis-6/12 bg-green-hard-bg w-36 h-12 flex justify-center items-center rounded-md mt-5 ml-10 cursor-pointer"
            >
              <FaPlus className="text-2xl text-white" />
              <span className="text-white pl-3">เพิ่มสินค้า</span>
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ zIndex: 1000 }}
          >
            <Box
              sx={{
                ...style,
                border: '0.1px solid #ccc', // กำหนดขอบ
                borderRadius: '8px', // รัศมีของมุมขอบ
                boxShadow: 2, // เพิ่มเงา
                pointerEvents: open ? 'auto' : 'none',
              }}
              tabIndex={open ? 0 : -1}
            >
              {/* Form Fields */}
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                ชื่อสินค้า
              </label>
              <TextField
                fullWidth
                id="name"
                variant="outlined"
                value={form.name || ""}
                onChange={handleChange}
                sx={{ mb: 2 }} // กำหนดระยะห่างด้านล่าง
              />

              <label htmlFor="numStock" className="block text-sm font-medium text-gray-700">
                จำนวน
              </label>
              <TextField
                fullWidth
                id="numStock"
                variant="outlined"
                value={form.numStock || ""}
                onChange={handleChange}
                type="number"
                sx={{ mb: 2 }} // กำหนดระยะห่างด้านล่าง
              />

              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                ประเภทสินค้า
              </label>
              <TextField
                fullWidth
                id="type"
                variant="outlined"
                value={form.type || ""}
                onChange={handleChange}
                sx={{ mb: 2 }} // กำหนดระยะห่างด้านล่าง
              />

              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                มูลค่าต่อชิ้น
              </label>
              <TextField
                fullWidth
                id="price"
                variant="outlined"
                value={form.price || ""}
                onChange={handleChange}
                type="number"
                step="0.01"
                sx={{ mb: 2 }} // กำหนดระยะห่างด้านล่าง
              />

              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                รายละเอียดสินค้า
              </label>
              <TextField
                fullWidth
                id="description"
                variant="outlined"
                value={form.description || ""}
                onChange={handleChange}
                multiline
                rows={4}
                sx={{ mb: 2 }} // กำหนดระยะห่างด้านล่าง
              />

              <Grid item xs={12} sx={{ mb: 2 }}> {/* ระยะห่างสำหรับ WebcamCapture */}
                <WebcamCapture
                  className="bg-white"
                  id="image"
                  onCapture={handleCaptureimage}
                  ModuleName="Product"
                />
              </Grid>

              <div className="flex justify-end mt-5">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <FaRegSave className="mr-1" />
                  บันทึก
                </button>
              </div>
            </Box>
          </Modal>


          {products.map((product) => {
            if (!product || typeof product.approved === 'undefined') {
              return null;
            }
            return (
              <div key={product.id} className="relative w-full h-auto bg-white rounded-md inner-shadow p-5 mt-10">
                <div className="grid grid-cols-3 gap-4">
                  {/* สี่เหลี่ยมสถานะการอนุมัติ */}
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 text-white font-bold rounded-md ${product.approved ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    title={product.approved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                  >
                    {product.approved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                  </div>

                  {/* ปุ่มแก้ไข */}
                  <button
                    className="absolute top-2 right-24 px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-700"
                    onClick={() => handleEdit(product)} // เรียกใช้ฟังก์ชัน handleEdit เมื่อคลิก
                    title="แก้ไขสินค้า"
                  >
                    แก้ไข
                  </button>

                  <div>
                    {/* ตรวจสอบว่ามี image หรือไม่ */}
                    {product.image && product.image.data && product.image.data.attributes && product.image.data.attributes.url ? (
                      <img
                        src={`${API_URL}${product.image.data.attributes.url}`}
                        alt={product.name || 'No Name'}
                        className="w-full h-auto"
                      />
                    ) : (
                      <img src={onion} alt="default" className="w-full h-auto" />
                    )}
                  </div>
                  <p className="col-span-2 text-2xl mt-8">{product.name || 'No Name'}</p>
                </div>

                {/* ส่วนแสดงข้อมูลสินค้าอื่น ๆ */}
                <div className="grid grid-cols-4 gap-4 mt-10">
                  <p className="col-span-2">จำนวนสินค้าในสต็อก</p>
                  <p className="text-center">{product.numStock || 0}</p>
                  <p className="text-right">ชิ้น</p>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-10">
                  <p className="col-span-2">ราคาต่อชิ้น</p>
                  <p className="text-center">{product.price || 0}</p>
                  <p className="text-right">บาท</p>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-10">
                  <p className="col-span-2">จำนวนเงินทั้งหมด</p>
                  <p className="text-center">{(product.price * product.numStock) || 0}</p>
                  <p className="text-right">บาท</p>
                </div>
              </div>
            );
          })}
        </Container>
      </ThemeProvider>
    </>
  );
}
