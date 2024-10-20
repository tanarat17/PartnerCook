import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ShopHomeDetailResive = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const rawData = location.state?.rawData; // รับข้อมูล rawData

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (rawData) {
      try {
        // ลบเครื่องหมายคำพูดที่ไม่จำเป็น
        const cleanData = rawData.replace(/^"|"$/g, '').trim();

        // แปลง JSON string ให้เป็น object
        const parsedItems = JSON.parse(cleanData);

        // ใช้ข้อมูลที่ถูก parse และเซ็ตเป็น state
        setItems(parsedItems);
      } catch (error) {
        console.error("Error parsing rawData:", error);
      }
    }
  }, [rawData]);

  return (
    <div>
      <h1>Items List</h1>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div key={index}>
            <p>ID: {item.id}</p>
            <p>Name: {item.name}</p>
            <p>Counts: {item.counts}</p>
            <p>Point: {item.point}</p>
            <p>NumStock: {item.numStock}</p>
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}
      <button onClick={() => navigate(-1)}>Close</button>
    </div>
  );
};

export default ShopHomeDetailResive;
