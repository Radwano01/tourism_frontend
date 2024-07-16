import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";

const PackageDetailsPage = () => {
  const { id } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API}/packages/${id}/details`
        );
        setPackageDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching package details:", error);
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!packageDetails) {
    return <div>Error loading package details</div>;
  }

  const handlePayNow = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user.userId;
    navigate(`/payment/packages/${id}/users/${userId}`);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-3xl">Package Details Page</h1>
        <Header />
      </header>

      <main className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-2/3">
            <section className="hero relative mb-8">
              <img
                src={`${process.env.REACT_APP_IMAGES_URL}/${packageDetails.mainImage}`}
                alt={packageDetails.packageName}
                className="w-full h-auto rounded-md shadow-lg"
              />
              <h2 className="text-5xl font-bold absolute inset-0 flex items-center justify-center text-white p-2">
                {packageDetails.packageName}
              </h2>
            </section>

            <div className="flex gap-4">
              <div className="w-2/3">
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/${packageDetails.packageDetails.imageOne}`}
                  alt="Package Image One"
                  className="w-full rounded-md shadow-lg"
                  style={{height:400}}
                />
              </div>
              <div className="flex flex-col w-1/3 gap-4">
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/${packageDetails.packageDetails.imageTwo}`}
                  alt="Package Image Two"
                  className="w-full rounded-md shadow-lg"
                  style={{ height:192 }} // Adjust height to match imageOne
                />
                <img
                  src={`${process.env.REACT_APP_IMAGES_URL}/${packageDetails.packageDetails.imageThree}`}
                  alt="Package Image Three"
                  className="w-full rounded-md shadow-lg"
                  style={{ height:192 }} // Adjust height to match imageOne
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-5">{packageDetails.packageName}</h2>
            <p className="mt-3">
              {packageDetails.packageDetails.description}
            </p>
          </div>

          <div className="md:w-1/3">
            <div className="p-5 rounded-lg bg-gray-100">
              <h4 className="text-xl font-bold mb-3">EACH PERSON:</h4>
              <p className="text-gray-600 mb-3">{packageDetails.price}$</p>
              <h4 className="text-xl font-bold mb-3">RATE:</h4>
              <p className="text-gray-600 mb-3">{packageDetails.rate} Stars</p>
              <button
                onClick={handlePayNow}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Pay Now!
              </button>

              <div className="mt-5">
                <h4 className="text-xl font-bold mb-3">Benefits:</h4>
                <ul className="list-disc mt-3 pl-5">
                  {packageDetails.benefits.map((benefit, index) => (
                    <li key={index} className="mb-2">{benefit.benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <h4 className="text-xl font-bold mb-3">Roadmap:</h4>
                <ul className="list-disc mt-3 pl-5">
                  {packageDetails.roadmaps.map((roadmap, index) => (
                    <li key={index} className="mb-2">{roadmap.roadmap}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PackageDetailsPage;