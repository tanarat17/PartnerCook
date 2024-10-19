import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Uploadfile2 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile); // เปลี่ยน 'file' เป็นชื่อฟิลด์ที่เซิร์ฟเวอร์ต้องการ

    try {
      const response = await fetch('YOUR_API_ENDPOINT', { // เปลี่ยน YOUR_API_ENDPOINT เป็น URL ของ API ที่ใช้ในการอัปโหลด
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(`อัปโหลดไฟล์สำเร็จ: ${result.message}`);
      } else {
        setUploadStatus('การอัปโหลดไฟล์ล้มเหลว');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    }
  };

  return (
    <div>
      <h2>อัปโหลดไฟล์</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>อัปโหลด</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default Uploadfile2;
