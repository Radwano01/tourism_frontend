import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "../../components/Header";

const CountryDetailsPage = () => {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [places, setPlaces] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        const countryResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API}/countries/${id}/details`
        );
        setCountry(countryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching country details:", error);
        setLoading(false);
      }
    };

    const fetchPlaces = async () => {
      try {
        const placesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API}/countries/${id}/places`
        );
        setPlaces(placesResponse.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    const fetchPackages = async () => {
      try {
        const packagesResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API}/countries/${id}/packages`
        );
        setPackages(packagesResponse.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchCountryDetails();
    fetchPlaces();
    fetchPackages();
  }, [id]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!country) {
    return <div>Error loading country details</div>;
  }

  return (
    <div className="country-details-page">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">Country Details Page</h1>
        <Header />
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        <section className="hero mb-8 relative">
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/${country.countryMainImage}`}
            alt={`${country.country} Skyline`}
            className="w-full h-auto rounded-md shadow-lg"
            style={{ maxWidth: "1000px", maxHeight: "300px" }}
          />
          <h2 className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold bg-black bg-opacity-50 p-2">
            {country.country.toUpperCase()}
          </h2>
        </section>

        <section className="images grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="country-image">
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/${country.imageOne}`}
              alt={`${country.country} Image One`}
              className="w-full h-48 rounded-md shadow-lg object-cover"
            />
          </div>
          <div className="country-image">
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/${country.imageTwo}`}
              alt={`${country.country} Image Two`}
              className="w-full h-48 rounded-md shadow-lg object-cover"
            />
          </div>
          <div className="country-image">
            <img
              src={`${process.env.REACT_APP_IMAGES_URL}/${country.imageThree}`}
              alt={`${country.country} Image Three`}
              className="w-full h-48 rounded-md shadow-lg object-cover"
            />
          </div>
        </section>
        <section className="description mb-8">
          <div className="w-full pr-4">
            <p>{country.description}</p>
          </div>
        </section>

        {places.length > 0 && (
          <section className="places mb-8">
            <h2 className="text-2xl font-bold mb-4">Country Places</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {places.map((place) => (
                <div
                  key={place.id}
                  className="place cursor-pointer rounded-md overflow-hidden shadow-lg"
                  onClick={() => handleNavigate(`/place/details/${place.id}`)}
                >
                  <img
                    src={`${process.env.REACT_APP_IMAGES_URL}/${place.mainImage}`}
                    alt={`${place.place}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold mb-2">
                      {place.place}
                    </h3>
                    <p className="text-sm">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {packages.length > 0 && (
          <section className="packages">
            <h2 className="text-2xl font-bold mb-4">Country Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="package cursor-pointer rounded-md overflow-hidden shadow-lg"
                  onClick={() => handleNavigate(`/package/details/${pkg.id}`)}
                >
                  <img
                    src={`${process.env.REACT_APP_IMAGES_URL}/${pkg.mainImage}`}
                    alt={pkg.packageName}
                    className="w-full h-auto"
                  />
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-semibold mb-2">
                      {pkg.packageName}
                    </h3>
                    <p className="text-sm">{pkg.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CountryDetailsPage;
