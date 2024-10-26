import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import FileUpload from "../components/FileUpload.jsx";
import { Checkbox, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import WebcamCapture from "../components/WebcamCapture.jsx";
import { getUser, updateUser } from "../api/strapi/userApi"; // Import updateUser function
import { uploadImage } from "../api/strapi/uploadApi"; // Import uploadImage function


function UpdateUserProfile() {
  const userId = import.meta.env.VITE_USER_ID;
  const token = import.meta.env.VITE_TOKEN_TEST;
  const API_URL = import.meta.env.VITE_API_URL;

  const theme = createTheme({
    typography: {
      fontFamily: "Sarabun",
    },
  });

  // Initial formData state is set with empty fields
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    telNumber: "",
    gender: "",
    address: "",
    cardID: "",
    photoImage: "",
    checkedOne: false,
  });
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const [isFormValid, setIsFormValid] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Function to handle file change from FileUpload component
	const handleFileChange = (file) => {
		setFormData((prevData) => ({
		  ...prevData,
		  photoImage: file, // Store the file in formData
		}));
	  };

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id || name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const {
      username,
      fullName,
      telNumber,
      gender,
      address,
      cardID,
      checkedOne,
    } = formData;

    setIsFormValid(
      username &&
        fullName &&
        telNumber &&
        gender &&
        address &&
        cardID &&
        checkedOne
    );
  }, [formData]);

  // Fetch user data and set the formData
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUser(userId, token);
        setUser(userData);
        setFormData({
          username: userData.username || "",
		//   email: userData.email || "",
        //   password: userData.password || "cookcook", // Leave password empty for security reasons
          fullName: userData.fullName || "",
          telNumber: userData.telNumber || "",
          gender: userData.gender || "",
          address: userData.address || "",
          cardID: userData.cardID || "",
        //   photoImage: userData.photoImage || "", // Assuming the image is not fetched here
          checkedOne: false, // Assume consent is not automatically checked
        });
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching users:", error);
        // setError(error.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, token]);

  const createPhotoImageObject = (uploadedImageData) => {
	return {
	  id: uploadedImageData.id,
	  name: uploadedImageData.name,
	  alternativeText: uploadedImageData.alternativeText || null,
	  caption: uploadedImageData.caption || null,
	  width: uploadedImageData.width,
	  height: uploadedImageData.height,
	  formats: uploadedImageData.formats, // If formats are available
	  hash: uploadedImageData.hash,
	  ext: uploadedImageData.ext,
	  mime: uploadedImageData.mime,
	  size: uploadedImageData.size,
	  url: uploadedImageData.url,
	  provider: uploadedImageData.provider,
	  createdAt: uploadedImageData.createdAt,
	  updatedAt: uploadedImageData.updatedAt,
	};
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let uploadedImageObject = null;

      // อัปโหลดรูปภาพก่อน ถ้ามีรูปภาพที่จะอัปโหลด
      if (formData.photoImage) {
        const uploadedImageData = await uploadImage(formData.photoImage);
        uploadedImageObject = createPhotoImageObject(uploadedImageData); // สร้าง object สำหรับ photoImage
      }
      const userData = {
        username: formData.username,
        email: formData.email, // Assuming email is the same as username in this example
        password: formData.password,
        photoImage: uploadedImageObject, // Add the uploaded image URL if it exists
        fullName: formData.fullName,
        telNumber: formData.telNumber,
        gender: formData.gender,
        address: formData.address,
        cardID: formData.cardID,
      };
      // Call the updateUser function to send the updated formData to the API
      await updateUser(user.id, userData, token);
      alert("User data updated successfully!");
	//   navigate("/home");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating user data");
    }
  };

  const handleImageCapture = (imageSrc) => {
    setFormData((prevData) => ({
      ...prevData,
      photoImage: imageSrc,
    }));
  };

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error: {error}</p>; // Error state

  return (
    <ThemeProvider theme={theme}>
      <Header />
	  <FileUpload
	  	//  photoImage={user?.photoImage?.url}
	  	photoImage={user?.photoImage?.url ? `${API_URL}${user.photoImage.url}` : ""} // Pass photoImage from the user data
        onFileChange={handleFileChange} // Pass handleFileChange function
      />
      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-1/2 px-2">
              <TextField
                id="username"
                label="ชื่อผู้ใช้"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="fullName"
                label="ชื่อ-นามสกุล"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-1/2 px-2 mt-4">
              <TextField
                id="telNumber"
                label="เบอร์โทร"
                variant="outlined"
                className="w-full bg-white"
                required
                value={formData.telNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full px-2 mt-4">
              <FormControl>
                <FormLabel>เพศ</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value="Null"
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="ชาย"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="หญิง"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="w-full px-2 mt-4">
              <TextField
                id="address"
                label="ที่อยู่"
                placeholder="ที่อยู่"
                multiline
                rows={4}
                className="w-full bg-white"
                required
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full px-2 mt-4">
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
            <div className="w-full px-2 mt-4">
              <WebcamCapture onCapture={handleImageCapture} />
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
          <span>
            <strong>กุ๊ก</strong>ให้ความสำคัญเกี่ยวกับความปลอดภัยข้อมูลของคุณ{" "}
            <span className="text-left leading-loose">
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

export default UpdateUserProfile;
