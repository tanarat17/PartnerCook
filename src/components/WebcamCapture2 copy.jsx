// src/components/WebcamCapture2.jsx
import { useState, useRef, useEffect } from "react"
import styled from "styled-components"

// Define styled components for styling
const WebcamContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
`

const WebcamVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
`

const PreviewImg = styled.img`
  width: 100%;
  border-radius: 10px;
  @media (max-width: 767px) {
    height: auto;
    object-fit: cover;
    border-radius: 0;
  }
`

const WebcamCanvas = styled.canvas`
  display: none; /* Hide canvas by default */
`

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
`

const WebcamCapture2 = ({ onCapture, ModuleName }) => {  // รับ onCapture และ shopId เป็น prop
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [mediaStream, setMediaStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)

  useEffect(() => {
    startWebcam()
    return () => {
      stopWebcam()
    }
  }, [])

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user"
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
      alert("ไม่สามารถเข้าถึงเว็บแคมได้ กรุณาตรวจสอบการตั้งค่าและอนุญาตการเข้าถึง");
    }
  }

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        track.stop()
      })
      setMediaStream(null)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      // Set canvas dimensions to match video stream
      if (context && video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image blob from canvas
        canvas.toBlob((blob) => {
          if (blob) {
            // ใช้วันที่และเวลาในการตั้งชื่อไฟล์
            const currentDateTime = new Date().toLocaleString().replace(/[/,:]/g, '-');
            const newName = `image_${ModuleName}_${currentDateTime}.jpg`; // ตั้งชื่อใหม่ด้วย shopId และวันเวลา
            const file = new File([blob], newName, { type: 'image/jpeg' });
            setCapturedImage(URL.createObjectURL(blob))
            stopWebcam()
            onCapture(file) 
          }
        }, 'image/jpeg')
      }
    }
  }

  const resetState = () => {
    stopWebcam() // Stop the webcam if it's active
    setCapturedImage(null) // Reset captured image
    onCapture(null)  
  }

  return (
    <WebcamContainer>
      {capturedImage ? (
        <>
          <PreviewImg src={capturedImage} className="captured-image" />
          <WebcamButton style={{ backgroundColor: "red", color: "white", width: '83.333333%' }} onClick={resetState}>รีเซ็ตรูป</WebcamButton>
        </>
      ) : (
        <>
          <div className="w-full h-auto bg-white md:w-full md:h-auto lg:w-full lg-h-auto">
            <WebcamVideo ref={videoRef} autoPlay muted />
            <WebcamCanvas ref={canvasRef} />
            <WebcamButton style={{ backgroundColor: "#026D44", color: "white", width: '83.333333%' }} onClick={captureImage}>ถ่ายรูป</WebcamButton>
          </div>
        </>
      )}
    </WebcamContainer>
  )
}

export default WebcamCapture2
