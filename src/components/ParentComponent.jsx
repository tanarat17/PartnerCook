// src/components/ParentComponent.jsx
import React from 'react';
import WebcamCapture from './WebcamCapture';

const ParentComponent = () => {
  // ฟังก์ชันที่จะจัดการกับการจับภาพ
  const handleCapture = (file) => {
    if (file) {
      console.log("Captured file: ", file);
      // ทำงานกับไฟล์ที่ถูกจับ เช่น ส่งไปยังเซิร์ฟเวอร์
    } else {
      console.log("Image capture was reset");
    }
  };

  return (
    <div>
      <h1>Webcam Capture Example</h1>
      <WebcamCapture onCapture={handleCapture} />
    </div>
  );
};

export default ParentComponent;
