import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../../components/Header";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API}/hotels/${id}/rooms/details`
        );
        setRoomDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room details:", error);
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handlePayNowClick = () => {
    navigate(`/payment/hotels/${id}/users/1`, {
      state: {
        price: roomDetails.price,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomDetails) {
    return <div>No room details available.</div>;
  }

  const {
    hotelName,
    address,
    rate,
    imageOne,
    imageTwo,
    imageThree,
    imageFour,
    description,
    price,
    hotelFeatures,
    roomFeatures,
  } = roomDetails;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl">{hotelName} Details</h1>
          <Header />
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
          <section className="hero relative mb-8">
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/${imageOne}`}
              alt="Hotels"
              className="w-full object-cover rounded-lg"
              style={{ maxHeight: "500px" }}
            />
            <h2 className="text-5xl font-bold absolute inset-0 flex items-center justify-center text-white p-2">
              {hotelName}
            </h2>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <img
                src={`${process.env.REACT_APP_IMAGES_URL}/${imageTwo}`}
                alt="Hotel Exterior"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div>
              <img
                src={`${process.env.REACT_APP_IMAGES_URL}/${imageThree}`}
                alt="Hotel Room"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <div>
              <img
                src={`${process.env.REACT_APP_IMAGES_URL}/${imageFour}`}
                alt="Hotel Room with View"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Overview</h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-bold">Rating:</span> {rate} Stars
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-bold">Location:</span> {address}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Booking Information</h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-bold">Price:</span> ${price} per night
                </p>
                <div className="mb-4">
                  <label className="block mb-2 font-bold text-gray-700">
                    Start Time
                  </label>
                  <DatePicker
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-bold text-gray-700">
                    End Time
                  </label>
                  <DatePicker
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  onClick={handlePayNowClick}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mt-4"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Hotel Features</h3>
            {hotelFeatures.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {hotelFeatures.map((feature, index) => (
                  <li key={index}>{feature.hotelFeatures}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No hotel features available.</p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Room Features</h3>
            {roomFeatures.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700">
                {roomFeatures.map((feature, index) => (
                  <li key={index}>{feature.roomFeatures}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No room features available.</p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Additional Information</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomDetailsPage;