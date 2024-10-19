// src/components/WebcamCapture.jsx
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { MdCamera } from "react-icons/md"; // นำเข้าไอคอนกล้องจาก react-icons

// Define styled components for styling
const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
`;

const WebcamButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
`;

const Icon = styled(MdCamera)`
  font-size: 50px;
  color: #026d44;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #026d44;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const WebcamCapture = ({ onCapture, ModuleName }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
      alert("ไม่สามารถเข้าถึงเว็บแคมได้ กรุณาตรวจสอบการตั้งค่าและอนุญาตการเข้าถึง");
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop();
      });
      setMediaStream(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const currentDateTime = new Date().toLocaleString().replace(/[/,:]/g, '-');
            const newName = `image_${ModuleName}_${currentDateTime}.jpg`;
            const file = new File([blob], newName, { type: 'image/jpeg' });
            setCapturedImage(URL.createObjectURL(blob));
            stopWebcam();
            onCapture(file);
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleUploadImage = () => {
    // Functionality for uploading image (you may want to implement it)
    alert("ฟังก์ชันการอัพโหลดภาพยังไม่ได้รับการกำหนด");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetState = () => {
    stopWebcam();
    setCapturedImage(null);
    onCapture(null);
  };

  return (
    <WebcamContainer>
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" />
      ) : (
        <>
          <IconContainer onClick={openModal}>
            <Icon />
          </IconContainer>
          {isModalOpen && (
            <Modal>
              <ModalContent>
                <h2>เลือกการดำเนินการ</h2>
                <ModalButton onClick={() => { captureImage(); closeModal(); }}>ถ่ายรูป</ModalButton>
                <ModalButton onClick={() => { handleUploadImage(); closeModal(); }}>อัพโหลดภาพ</ModalButton>
                <button onClick={closeModal}>ปิด</button>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </WebcamContainer>
  );
};

export default WebcamCapture;
