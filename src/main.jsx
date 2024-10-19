import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LiffProvider } from 'react-liff';
import { CartProvider } from './components/CartContext';
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Home from './pages/Home.jsx';
import HistoryPoint from './pages/History_point.jsx';
import HistoryServiceMachine from './pages/History_service_machine.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ShopDetails from './pages/ShopDetails.jsx';
import ShopDetailsKhunnaiwimon from './pages/ShopDetailsKhunnaiwimon.jsx';
import MapKhunnaiWimon from './components/MapKhunnaiWimon.jsx';
import MapNaitonmai from './components/MapNaitonmai.jsx';
import ShopDetailsNaiTonMai from './pages/ShopDeatilNaiTonMai.jsx';
import ShopDetailParanee from './pages/ShopDetailParanee.jsx';
import MapParanee from './components/MapParanee.jsx';
import ShopDetailNaiKrung from './pages/ShopDetailNaiKrung.jsx';
import MapKrung from './components/MapKrung.jsx';
import ShopDetailKamalad from './pages/ShopDetailKamalad.jsx';
import MapKamalad from './components/MapKamalad.jsx';
import Conclusion from './pages/Conclusion.jsx';
import MachinePosition from './pages/MachinePosition.jsx';
import ContactUs from './pages/ContactUs.jsx';
import ConfirmOrder from './pages/partner/ConfirmOrder.jsx';
import ProfileStore from './pages/partner/ProfileStore.jsx';
import ContactUs_Partner from './pages/partner/ContactUs.jsx';
import PDPA from './pages/partner/PDPA.jsx';
import GetMoneyItems from './pages/partner/GetMoneyItems.jsx';
import AddProduct from './pages/partner/AddProduct.jsx';
import ChooseShop from './pages/ChooseShop.jsx';
import ChooseWimon from './pages/ChooseWimon.jsx';
import Register from './pages/Register.jsx';
import LoginRegister from './pages/LoginRegister.jsx';
import Login from './pages/Login.jsx';
import ShopList from './pages/ShopList.jsx';
import Map from './pages/Map.jsx';
import UpdateUserProfile from './pages/UpdateUserProfile.jsx';
import CartSummary from './pages/CartSummary.jsx';
import ShopHome from './pages/partner/shopHome.jsx';
import ShopHomeDetail from './pages/partner/ShopHomeDetail.jsx';
import ShopHomeDetailResive from './pages/partner/ShopHomeDetailResive.jsx';
import ProfileStoreEdit from './pages/partner/ProfileStoreEdit.jsx';
import ShopHomeDetailPreSlip from './pages/partner/ShopHomeDetailPreSlip.jsx';
import { useLiff } from 'react-liff';


// const cors = require("cors");

// app.use(cors({
// 	origin:"http://localhost:5173/",
// 	methods:["GET","POST","PUT","DELETE"]
// });


const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:1337";
const token = import.meta.env.VITE_TOKEN_TEST; 
const LiffPartner = import.meta.env.VITE_LIFF_ID;


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/home",
    element: <Home />
  },
  {
    path: "/cart",
    element: <CartSummary />

  },
  {
    path: "/register/:userId",
    element: <Register />
  },
  {
    path: "/shopList",
    element: <ShopList />
  },
  {
    path: "/first",
    element: <LoginRegister />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/choose/wimon",
    element: <ChooseWimon />
  },
  {
    path: "/shop/:id",
    element: <ChooseShop />
  },
  {
    path: "/history-point/:id",
    element: <HistoryPoint />
  },
  {
    path: "/history-service-machine/:id",
    element: <HistoryServiceMachine />
  },
  {
    path: "/UserProfile",
    element: <UserProfile />
  },
  {
    path: "/register/:userId",
    element: <Register />
  },
  {
    path: "/update-user-profile",
    element: <UpdateUserProfile />
  },
  {
    path: "/store-map/khunnaiwimon",
    element: <MapKhunnaiWimon />
  },
  {
    path: "/store-map/naitonmai",
    element: <MapNaitonmai />
  },
  {
    path: "/store-map/paranee",
    element: <MapParanee />
  },
  {
    path: "/store-map/krung",
    element: <MapKrung />
  },
  {
    path: "/store-map/kamalad",
    element: <MapKamalad />
  },
  {
    path: "/conclusion",
    element: <Conclusion />
  },
  {
    path: "/machine-position",
    element: <MachinePosition />
  },
  {
    path: "/map",
    element: <Map />
  },
  {
    path: "/contact-us",
    element: <ContactUs />
  },
  {
    path: "/partner",
    element: <ConfirmOrder />
  },
  {
    path: "/partner/ProfileStore",
    element: <ProfileStore />
  },
  {
    path: "/partner/contact-us",
    element: <ContactUs_Partner />
  },
  {
    path: "/partner/pdpa",
    element: <PDPA />
  },

  {
    path: "/shopHome",
    element: <ShopHome />
  },

  {
    path: "/partner/shopHome",
    element: <ShopHome />
  },
  // navigate('/partner/shopHome');


  {
    path: "/partner/shopRegister",
    element: <shopRegister />
  },


  {
    path: "/partner/get-money-item",
    element: <GetMoneyItems />
  },
  {
    path: "/partner/add-product",
    element: <AddProduct />
  },

  {
    path: "/ProfileStore",  // เส้นทางใหม่
    element: <ProfileStore />
  },

  {
    path: "/partner/shopHomeDetail",  // เส้นทางใหม่
    element: <ShopHomeDetail />
  },


  {
    path: "/shopHomeDetail",  // ScanQrCode
    element: <ShopHomeDetail />
  },


  {
    path: "/partner/shopHomeDetailResive",  //DetailSlipProductNoPayment 
    element: <ShopHomeDetailResive />
  },
  {
    path: "/shopHomeDetailResive",          //DetailSlipProductNoPayment 
    element: <ShopHomeDetailResive />
  },


  {
    path: "/partner/ProfileStoreEdit",  //DetailSlipProductNoPayment 
    element: <ProfileStoreEdit />
  },
  {
    path: "/ProfileStoreEdit",          //DetailSlipProductNoPayment 
    element: <ProfileStoreEdit />
  },


  
  {
    path: "/partner/ShopHomeDetailPreSlip",  //DetailSlipProductNoPayment 
    element: <ShopHomeDetailPreSlip />
  },
  {
    path: "/ShopHomeDetailPreSlip",          //DetailSlipProductNoPayment 
    element: <ShopHomeDetailPreSlip />
  },

  
  //{
  //   path: "/partner/ShopHomeSlipSend",  //DetailSlipProductNoPayment 
  //   element: <ShopHomeSlipSend />
  // },
  // {
  //   path: "/ShopHomeSlipSend",          //DetailSlipProductNoPayment 
  //   element: <ShopHomeSlipSend />
  // },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LiffProvider liffId={LiffPartner}>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </LiffProvider>
  </StrictMode>,
)
