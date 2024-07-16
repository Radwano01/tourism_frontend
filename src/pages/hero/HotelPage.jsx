import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components/Header";

const HotelPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const hotelsPerPage = 6;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API}/hotels/hotel/places/${id}?page=${totalPages}&size=${hotelsPerPage}`
        );
        console.log(response.data)
        const hotelData = response.data;
        setHotels(hotelData);
        setTotalPages(Math.ceil(hotelData.length / hotelsPerPage));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      }
    };

    fetchHotels();
  }, [id]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate the hotels to display on the current page
  const startIndex = currentPage * hotelsPerPage;
  const currentHotels = hotels.slice(startIndex, startIndex + hotelsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">Hotel Page</h1>
        <Header />
      </header>

      <main className="p-4 max-w-4xl mx-auto items-center">
        <section className="results mt-8 mb-8">
          {currentHotels.length > 0 ? (
            currentHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="hotel-listing mt-8 flex flex-col md:flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/${hotel.mainImage}`}
                  alt={hotel.hotelName}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-lg mb-4 md:mb-0"
                  style={{ width: "270px", height: "170px" }}
                />
                <div className="text-center md:text-left md:w-2/3 md:pl-4">
                  <h3 className="text-xl font-bold">{hotel.hotelName}</h3>
                  <p className="text-gray-600 mb-4">{hotel.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{hotel.rate} Stars</span>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => handleNavigate(`/room/details/${hotel.id}`)}
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 text-xl mt-8">
              No hotels available.
            </div>
          )}
        </section>

        <nav className="pagination flex justify-center items-center gap-4 mt-8">
          <button
            className={`pagination-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
              currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="pagination-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            {currentPage + 1}
          </span>
          <button
            className={`pagination-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${
              currentPage === totalPages - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </button>
        </nav>
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <p>Copyright © 2023 Radwan</p>
      </footer>
    </div>
  );
};

export default HotelPage;