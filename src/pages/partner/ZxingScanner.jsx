// src/components/ZxingScanner.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

const ZxingScanner = ({ onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          onScan(result.getText());
          codeReader.reset();
        }
        if (err && !(err.name === 'NotFoundException')) {
          setError(err.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });

    // Cleanup เมื่อคอมโพเนนต์ถูกยกเลิก
    return () => {
      codeReader.reset();
    };
  }, [onScan]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>สแกน QR โค้ด</h2>
      <video
        ref={videoRef}
        style={{ width: '100%', maxWidth: '400px', margin: 'auto' }}
        muted
        playsInline
      />
      {error && <p style={{ color: 'red' }}>เกิดข้อผิดพลาด: {error}</p>}
    </div>
  );
};

export default ZxingScanner;
