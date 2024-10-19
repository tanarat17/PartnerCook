import React from "react";
import Header from "../components/Header.jsx";
import "../index.css";
import coin from "../assets/images/coins.png";
import Container from '@mui/material/Container'
import BackgroundPoint from '../assets/images/fruit.png';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllHistoryPoints } from "../api/strapi/historyPointApi";
import { convertDateTime } from '../components/ConvertDateTime';

function History_point() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = import.meta.env.VITE_TOKEN_TEST;
  const { id } = useParams();
  const [ points, setHistoryPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoryPoints = async () => {
      try {
        setLoading(true);
        const pointsData = await getAllHistoryPoints(id, token);
        setHistoryPoints(pointsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching history points:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchHistoryPoints();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <p className="text-center mt-16 text-2xl">คะแนนสะสม</p>
        <div className="flex justify-center mt-8">
            <img src={coin} alt="coins" width="120" />
        </div>
        <p className="text-center mt-8 text-xl font-semibold">{points[0].user.point} แต้ม</p>
        <p className="text-center mt-10 text-2xl font-semibold">
            ประวัติการแลกแต้ม
        </p>

        {points.map((point, index) => (
          <div key={index} className="shadow-inner w-full max-w-md mx-auto h-auto bg-white mt-10 rounded-lg mb-6 p-4">
            <div className="flex justify-center">
              <img
                src={point.shop?.image?.data?.attributes?.url ? `${API_URL}${point.shop.image.data.attributes.url}` : BackgroundPoint}
                alt={`ร้าน ${point.shop?.name}`}
                className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover"
              />
            </div>
            <div className="flex justify-center mt-4 text-lg sm:text-xl font-semibold">
              <p>{point.shop.name}</p>
            </div>
            <div className="grid grid-cols-[4fr_2fr_3fr] mt-10 text-lg sm:text-xl">
              <p className="pl-4 sm:pl-8">แลกแต้มทั้งหมด</p>
              <p className="text-center">{point.totalPoint}</p>
              <p className="pr-4 sm:pr-8 text-right">แต้ม</p>
            </div>
            <p className="mt-6 text-center text-sm sm:text-lg">{convertDateTime(point.date, point.time)}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
export default History_point;
