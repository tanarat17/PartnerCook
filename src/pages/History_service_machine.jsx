import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import Container from "@mui/material/Container";
import "../index.css";
import can from "../assets/images/Can_2_.png";
import bottle from "../assets/images/bottle.png";
import cookLogo from "../assets/images/logo.png";
import oilbottle from '../assets/images/oil bottle.png'
import { FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { getAllHistoryMachines } from "../api/strapi/historyMachineApi";
import { convertDateTime } from '../components/ConvertDateTime';

export default function History_service_machine() {
  const token = import.meta.env.VITE_TOKEN_TEST;
  const { id } = useParams();
  const [recycleMachines, setRecycleMachines] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCity, setActiveCity] = useState(
    "ตู้รับทิ้งขวดพลาสติกและกระป๋องอลูมิเนียม"
  );

  // Function to handle tab click
  const openCity = (type) => {
    setActiveCity(type);
  };
  useEffect(() => {
    const fetchRecycleMachines = async () => {
      try {
        setLoading(true);
        const recycleMachinesData = await getAllHistoryMachines(id, token);
        setRecycleMachines(recycleMachinesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching recycleMachiness:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchRecycleMachines();
  }, [id, token]);
  // const formattedDateTime = convertDateTime(date, time);
  console.log("recycleMachines: ", recycleMachines);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      {/* <h1>{id} {recycleMachines[0].type} {recycleMachines[0].date} {recycleMachines[0].time}</h1> */}
      <Container maxWidth="sm">
        <div className="text-2xl text-center mt-10">ประวัติการใช้บริการตู้</div>
        <div className="bg-grey-bg mt-20 grid grid-cols-2 rounded-t-lg">
          <button
            className={` tablink h-40 pt-5 text-xs  rounded-t-lg ${
              activeCity === "ตู้รับทิ้งขวดพลาสติกและกระป๋องอลูมิเนียม"
                ? "w3-green"
                : ""
            }`}
            onClick={() => openCity("ตู้รับทิ้งขวดพลาสติกและกระป๋องอลูมิเนียม")}
          >
            ตู้รับทิ้งขวดพลาสติกและกระป๋องอลูมิเนียม
            <div className="mt-5 grid grid-cols-2 ">
              <img src={can} alt="can" width="70" className="ml-5" />
              <img src={bottle} alt="bottle" width="40" className="ml-5" />
            </div>
          </button>
          <button
            className={`tablink text-xs  rounded-t-lg ${
              activeCity === "ตู้รับน้ำมันพืชใช้แล้ว" ? "w3-green" : ""
            }`}
            onClick={() => openCity("ตู้รับน้ำมันพืชใช้แล้ว")}
          >
            <p className="text-center">ตู้รับน้ำมันพืชใช้แล้ว</p>
            <div className="flex justify-center">
              <img src={cookLogo} alt="logo" width="70" className="mt-5" />
            </div>
          </button>
        </div>
        <div className="w-full h-full pb-14 bg-white shadow-md shadow-inner rounded-b-lg">
          <div
            id="bottle"
            className="w3-container  city"
            style={{
              display:
                activeCity === "ตู้รับทิ้งขวดพลาสติกและกระป๋องอลูมิเนียม"
                  ? "block"
                  : "none",
            }}
          >
          {recycleMachines.map((machine) => (
            <div key={machine.id} className="w-full shadow-can shadow-inner mt-10 mb-3 pb-5 p-2 bg-content rounded-lg">
              <div className="flex justify-center">
                {machine.type === "bottle" ? (
                  <img src={bottle} alt="bottle" width="60" className="mt-2" />
                ) : machine.type === "can" ? (
                  <img src={can} alt="can" width="60" className="mt-2" />
                ) : null}
              </div>

              <p className="text-center text-2xl font-bold mt-5">
                {machine.type === "bottle"
                  ? `ขวดพลาสติก ${machine.quantity || 0} ขวด`
                  : machine.type === "can"
                  ? `กระป๋องอลูมิเนียม ${machine.quantity || 0} กระป๋อง`
                  : null}
              </p>

              <div className="grid grid-rows-3">
                <div className="text-base mt-5">
                  <FaChevronRight className="float-left text-xl ml-3" />
                  &nbsp;&nbsp; {convertDateTime(machine.date, machine.time)}
                </div>

                <div className="text-base mt-5">
                  <FaChevronRight className="float-left text-xl ml-3" />
                  &nbsp;&nbsp; หมายเลขตู้เลขที่ {machine.serialNumber}
                </div>

                <div className="text-base mt-5">
                  <FaChevronRight className="float-left text-xl ml-3" />
                  &nbsp;&nbsp; แต้มที่ได้รับทั้งหมด {machine.point || 0} แต้ม
                </div>
              </div>
            </div>
          ))}
          </div>

        </div>
        <div className="w-full h-full bg-white shadow-md shadow-inner rounded-b-lg">
        <div
          id="oil"
          className="w3-container  city"
          style={{
            display: activeCity === "ตู้รับน้ำมันพืชใช้แล้ว" ? "block" : "none",
          }}
        >
         <div className="w-full shadow-can shadow-inner mt-10 mb-10 pb-5 p-2 bg-content rounded-lg">
              <div className="flex justify-center">
                <img src={oilbottle} alt="can" width="60" className="mt-2" />
              </div>
              <p className="text-center text-2xl font-bold mt-5">
                ขวดน้ำมันพืชใช้แล้ว 2 ขวด
              </p>
              <div className="grid grid-rows-3">
                <div className="text-base mt-5">
                  {" "}
                  <FaChevronRight className="float-left text-xl ml-3" />{" "}
                  &nbsp;&nbsp; วันอังคารที่ 17 เดือน สิงหาคม 2566 เวลา 10:30 น.
                </div>
                <div className="text-base mt-5">
                  {" "}
                  <FaChevronRight className="float-left text-xl ml-3" />{" "}
                  &nbsp;&nbsp; หมายเลขตู้เลขที่ 00011/00111
                </div>
                <div className="text-base mt-5">
                  {" "}
                  <FaChevronRight className="float-left text-xl ml-3" />{" "}
                  &nbsp;&nbsp; แต้มที่ได้รับทั้งหมด 100 แต้ม
                </div>
              </div>
            </div>
        </div>
        </div>

      </Container>
    </>
  );
}

