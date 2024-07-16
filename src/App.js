import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import CountryDetailsPage from "./pages/hero/CountryDetailsPage";
import FlightSearchPage from "./pages/hero/FlightSearchPage";
import HeroPage from "./pages/hero/HeroPage";
import HotelPage from "./pages/hero/HotelPage";
import PackageDetailsPage from "./pages/hero/PackageDetailsPage";
import PlaceDetailsPage from "./pages/hero/PlaceDetailsPage";
import RoomDetailsPage from "./pages/hero/RoomDetailsPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/auth/ProfilePage";
import { UserProvider } from "./components/UserContext";
import HotelPaymentPage from "./components/HotelPaymentPage";
import PackagePaymentPage from "./components/PackagePaymentPage";
import FlightPaymentPage from "./components/FlightPaymentPage";
import VerificationSuccess from "./pages/auth/VerificationSuccess";
import EditUserDetailsPage from "./pages/auth/EditUserDetailsPage";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password/:userId" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/verification/:email/:token" element={<VerificationSuccess/>} />
          <Route path="/edit-user-details/:userId" element={<EditUserDetailsPage/>} />

          <Route path="/" element={<HeroPage />} />
          <Route path="/country/details/:id" element={<CountryDetailsPage />} />
          <Route path="/place/details/:id" element={<PlaceDetailsPage />} />
          <Route path="/package/details/:id" element={<PackageDetailsPage />} />

          <Route path="/hotels/:id" element={<HotelPage />} />
          <Route path="/room/details/:id" element={<RoomDetailsPage />} />

          <Route path="/flights/:id" element={<FlightSearchPage />} />

          <Route path="/payment/hotels/:hotelId/users/:userId" element={<HotelPaymentPage />} />

          <Route path="/payment/packages/:packageId/users/:userId" element={<PackagePaymentPage />} />

          <Route path="/payment/flights/:flightId/users/:userId" element={<FlightPaymentPage />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
