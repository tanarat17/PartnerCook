import Header from '../components/Header';
import { useLocation } from 'react-router-dom';
import { useState } from 'react'; // for toggle switch
import QRCode from 'qrcode.react'; // Ensure you've installed this package: `npm install qrcode.react`

const CartSummary = () => {
  const location = useLocation();
  const { storedCounts, cartItems } = location.state || {};
  const parsedCounts = typeof storedCounts === 'string' ? JSON.parse(storedCounts) : storedCounts;

  const [isOn, setIsOn] = useState(false); // toggle state for QR code

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  let totalPointsSum = 0; // To store total points of all items
  let totalCountSum = 0; // To store total count of all items

  return (
    <>
      <Header />
      <div className="flex justify-center mt-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 w-full max-w-md border-2 border-gray-300">
          <h1 className="text-xl sm:text-2xl font-semibold text-center mb-4">Cart Summary</h1>
          <h2 className="text-md sm:text-lg font-semibold text-gray-700 mb-4 text-center">รายการที่เลือก</h2>
          <div className="border-b-2 border-gray-300 mb-4"></div>
          {cartItems && cartItems.length > 0 ? (
            <ul className="space-y-3 sm:space-y-4">
              {cartItems.map((item, index) => {
                const count = parsedCounts[item.id];
                if (count > 0) {
                  const totalPoints = item.point * count;
                  totalPointsSum += totalPoints; // Adding points to total sum
				  totalCountSum += count; // Adding count to total count
                  return (
                    <li key={item.id} className="flex flex-row justify-between items-start sm:items-center py-4 border-b border-gray-200">
                      <div className="sm:w-full">
                        <span className="font-semibold text-lg sm:text-xl">รายการที่ {index + 1}:</span>
                        <span className="text-md sm:text-lg ml-2">{item.name}</span>
                        <br />
                        <span className="text-sm sm:text-md text-gray-600">จำนวน {count} รายการ</span>
                      </div>
                      {item.point ? (
                        <div className="mt-2 text-md sm:text-lg text-gray-700">
                          <p>ใช้แต้มไป</p>
                          <p> {totalPoints} แต้ม</p>
                        </div>
                      ) : (
                        <span className="text-md sm:text-lg text-gray-500">ไม่มีแต้มสำหรับสินค้านี้</span>
                      )}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500">ไม่มีสินค้าในตะกร้า</p>
          )}
          <div className="border-t-2 border-gray-300 mt-4 pt-4">
            {/* Display total points */}
            <p className="text-center text-sm font-light">จำนวนทั้งหมด: {totalCountSum} รายการ</p>
            <p className="text-center text-lg font-semibold">แต้มรวมทั้งหมด: {totalPointsSum} แต้ม</p><br />
            <p className="text-center text-sm sm:text-lg text-gray-500 mt-2">ขอบคุณที่ใช้บริการ</p>
          </div>

          {/* QR Code section */}
          <p className="text-center pt-10 text-xl">สร้าง QR Code</p>
          <div className="mt-10 flex justify-center">
            <div className={`slider-container ${isOn ? "on" : ""}`} onClick={toggleSwitch}>
              <div className="slider">
                <div className="slider-button"></div>
              </div>
            </div>
          </div>
          {isOn && (
            <div className="mt-10 flex justify-center">
              <QRCode value="https://google.com" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSummary;
