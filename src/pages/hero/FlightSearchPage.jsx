import React, { useState, useEffect, useRef } from "react";
import { Header } from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const FlightSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const placeName = location.state ? location.state.placeName : "Unknown";

  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState(placeName);

  const [fromAirportId, setFromAirportId] = useState("");
  const [toAirportId, setToAirportId] = useState("");

  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [goingFromAvailableAirports, setGoingFromAvailableAirports] = useState(
    []
  );
  const [goingToAvailableAirports, setGoingToAvailableAirports] = useState([]);
  const [searchError, setSearchError] = useState("");

  const typingTimeoutRef = useRef(null); // Ref for debounce timeout

  useEffect(() => {
    const fetchImmediately = async (place) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API}/places/place?place=${place}`
        );
        setGoingToAvailableAirports(response.data);

        // Fetch airports immediately for "Going To" place
        const airportsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API}/places/${response.data[0].placeId}/airports`
        );
        setToAirportId(airportsResponse.data[0]?.airPortId); // Assuming there's one airport for simplicity
      } catch (error) {
        console.error("Error fetching airports:", error);
        setSearchError("Error fetching airports. Please try again later.");
      }
    };

    fetchImmediately(placeName);
  }, [placeName]);

  // Function to fetch place ID by place name
  const fetchPlaceId = async (placeName) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/places/place?place=${placeName}`
      );
      if (response.data && response.data.length > 0) {
        const place = response.data[0];
        return place.placeId;
      } else {
        throw new Error("No place found for the given name");
      }
    } catch (error) {
      console.error("Error fetching place ID:", error);
      throw new Error("Error fetching place ID");
    }
  };

  // Function to fetch airports by place ID
  const fetchAirportsByPlaceId = async (placeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/places/${placeId}/airports`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching airports:", error);
      throw new Error("Error fetching airports");
    }
  };

  // Function to fetch flights by airport IDs with pagination
  const fetchFlightsByAirportIds = async (
    fromAirportId,
    toAirportId,
    page,
    size
  ) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_API}/flights/flight/departures/${fromAirportId}/destinations/${toAirportId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching flights:", error);
      throw new Error("Error fetching flights");
    }
  };

  // Adjust handleSearchFlights function to use currentPage and flightsPerPage
  const handleSearchFlights = async () => {
    try {
      if (fromAirportId && toAirportId) {
        const flightsData = await fetchFlightsByAirportIds(
          fromAirportId,
          toAirportId,
          currentPage - 1, // Adjusting to zero-indexed page
          flightsPerPage
        );
        setFlights(flightsData);
        const totalPages = Math.ceil(flightsData.length / flightsPerPage);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  // Function to handle delayed fetch for "Going From" airport
  const handleFromAirportChange = (e) => {
    const inputPlaceName = e.target.value;
    setFromAirport(inputPlaceName);

    clearTimeout(typingTimeoutRef.current); // Clear previous timeout

    // Set new timeout
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const placeId = await fetchPlaceId(inputPlaceName);
        const airports = await fetchAirportsByPlaceId(placeId);
        setGoingFromAvailableAirports(airports);
        setFromAirportId(""); // Reset selected airport ID when place changes
      } catch (error) {
        console.error("Error fetching airports:", error);
        setGoingFromAvailableAirports([]);
      }
    }, 1000); // Delay of 1 second (adjust as needed)
  };

  // Function to fetch airports based on user input in "Going To" field
  const handleToAirportChange = async (e) => {
    const inputPlaceName = e.target.value;
    setToAirport(inputPlaceName);
    try {
      const placeId = await fetchPlaceId(inputPlaceName);
      const airports = await fetchAirportsByPlaceId(placeId);
      setGoingToAvailableAirports(airports);
      setToAirportId(""); // Reset selected airport ID when place changes
    } catch (error) {
      console.error("Error fetching airports:", error);
      setGoingToAvailableAirports([]);
    }
  };

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle formatting date and time
  const formatDateTime = (datetimeArray) => {
    if (datetimeArray.length === 6) {
      const [year, month, day, hour, minute, second] = datetimeArray;
      return new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        second
      ).toLocaleString();
    }
    return "Invalid Date";
  };

  const calculateDuration = (start, end) => {
    const startTime = new Date(
      start[0],
      start[1] - 1,
      start[2],
      start[3],
      start[4],
      start[5]
    );
    const endTime = new Date(
      end[0],
      end[1] - 1,
      end[2],
      end[3],
      end[4],
      end[5]
    );

    const durationMs = endTime - startTime;

    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor(
      (durationMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    return `${durationHours}h ${durationMinutes}m`;
  };

  const handleBuyNow = (flightId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;
    navigate(`/payment/flights/${flightId}/users/${userId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">Flight Page</h1>
        <Header />
      </header>

      <main className="p-4 max-w-4xl mx-auto flex-grow">
        <section className="hero relative mb-8">
          <img
            src="https://t3.ftcdn.net/jpg/03/00/75/64/360_F_300756454_jX9UODdWSoEWksF3WfY9B6LMd4yQse6R.jpg"
            alt="Flights"
            className="w-full rounded-lg"
          />
          <h2 className="text-5xl font-bold absolute inset-0 flex items-center justify-center text-white p-2">
            Flights
          </h2>
        </section>
        <section className="search flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-1/2">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Going From..."
              value={fromAirport}
              onChange={handleFromAirportChange}
            />

            <select
              className="w-full p-2 border border-gray-300 rounded mt-2"
              onChange={(e) => setFromAirportId(e.target.value)}
              value={fromAirportId}
            >
              <option value="" disabled>
                Select an airport...
              </option>
              {goingFromAvailableAirports.map((airport) => (
                <option key={airport.airPortId} value={airport.airPortId}>
                  {airport.airPortName}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/2">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Going To..."
              value={toAirport}
              onChange={handleToAirportChange}
            />
            <select
              className="w-full p-2 border border-gray-300 rounded mt-2"
              onChange={(e) => setToAirportId(e.target.value)}
              value={toAirportId}
            >
              <option value="" disabled>
                Select an airport...
              </option>
              {goingToAvailableAirports.map((airport) => (
                <option key={airport.airPortId} value={airport.airPortId}>
                  {airport.airPortName}
                </option>
              ))}
            </select>
          </div>
        </section>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSearchFlights}
        >
          Search Flights
        </button>

        {searchError && <p className="text-red-500 mt-2">{searchError}</p>}

        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Flight Results</h2>
          {flights.length === 0 && <p>No flights found.</p>}
          {currentFlights.map((flight) => (
            <article
              key={flight.flightId}
              className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between bg-white"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {flight.planeCompanyName}
                </h3>
                <p>
                  <strong>Departure:</strong>{" "}
                  {formatDateTime(flight.departureTime)}
                </p>
                <p>
                  <strong>Arrival:</strong> {formatDateTime(flight.arrivalTime)}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {calculateDuration(flight.departureTime, flight.arrivalTime)}
                </p>
                <p>
                  <strong>Price:</strong> ${flight.price}
                </p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleBuyNow(flight.flightId)}
                >
                  Buy Now
                </button>
              </div>
              <div className="md:w-1/3 ml-4">
                <div className="mb-2">
                  <p className="font-bold">Departure Airport</p>
                  <p>{flight.departureAirPort}</p>
                  <p>{flight.departureAirPortCode}</p>
                </div>
                <div>
                  <p className="font-bold">Destination Airport</p>
                  <p>{flight.destinationAirPort}</p>
                  <p>{flight.destinationAirPortCode}</p>
                </div>
              </div>
            </article>
          ))}

          {totalPages > 1 && (
            <nav className="flex justify-between mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handlePreviousPage}
              >
                Previous
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleNextPage}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Flight Booking App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FlightSearchPage;
