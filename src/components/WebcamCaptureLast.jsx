// src/components/WebcamCapture.jsx
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { IoCameraOutline } from "react-icons/io5";
import Swal from "sweetalert2";

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

const WebcamCanvas = styled.canvas`
  display: none; /* Hide canvas by default */
`;

const WebcamVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
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

const Icon = styled(IoCameraOutline)`
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

const ModalButtonTake = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #ffb300;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalButtonUpload = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: #558b2f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalButtonRed = styled.button`
  margin: 10px;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: darkred; /* Change color on hover */
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
`;

const WebcamCapture = ({ onCapture, ModuleName }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

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
      // alert("ไม่สามารถเข้าถึงเว็บแคมได้ กรุณาตรวจสอบการตั้งค่าและอนุญาตการเข้าถึง");
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเข้าถึงเว็บแคมได้ กรุณาตรวจสอบการตั้งค่าและอนุญาตการเข้าถึง",
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      })
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
    // alert("ฟังก์ชันการอัพโหลดภาพยังไม่ได้รับการกำหนด");
    Swal.fire({
      icon: "warning",
      title: "ฟังก์ชันการอัพโหลดภาพยังไม่ได้เปิดใช้งาน",
      position: 'center',
      showConfirmButton: true,
      confirmButtonText: "ตกลง",
    })
  };

  const openModal = () => {
    setIsModalOpen(true);
    startWebcam(); // Start webcam when modal opens
  };

  const closeModal = () => {
    setIsModalOpen(false);
    stopWebcam(); // Stop webcam when modal closes
  };

  const resetState = () => {
    stopWebcam();
    setCapturedImage(null);
    onCapture(null);
  };

  return (
    <WebcamContainer>
      {capturedImage ? (
        <PreviewImg src={capturedImage} alt="Captured" />
      ) : (
        <>
          <IconContainer onClick={openModal}>
            <Icon />
          </IconContainer>
          {isModalOpen && (
            <Modal>
              <ModalContent>
                <WebcamVideo ref={videoRef} autoPlay muted />
                <WebcamCanvas ref={canvasRef} />

                <ModalButtonTake onClick={() => { captureImage(); closeModal(); }}>ถ่ายรูป</ModalButtonTake>
                <ModalButtonUpload onClick={() => { handleUploadImage(); closeModal(); }}>อัพโหลดภาพ</ModalButtonUpload>
                <ModalButtonRed onClick={() => { closeModal(); }}>ปิด</ModalButtonRed>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </WebcamContainer>
  );
};

export default WebcamCapture;
