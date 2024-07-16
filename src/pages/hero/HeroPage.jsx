import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HeroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_API}/countries`)
      .then(response => {
        const formattedData = response.data.map(country => ({
          id: country.id,
          country: country.country,
          url: country.mainImage
        }));
        setImages(formattedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleNavigate = (id) => {
    navigate(`/country/details/${id}`);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={`${process.env.REACT_APP_IMAGES_URL}/${image.url}`} alt={`Slide ${image.id}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="relative z-10 text-center text-white">
        {images.length > 0 && <h1 className="text-8xl font-bold mb-8">{images[currentIndex].country}</h1>}
        {images.length > 0 && (
          <button
            className="bg-blue-500 py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-200"
            onClick={() => handleNavigate(images[currentIndex].id)}
          >
            View Details
          </button>
        )}
      </div>
      <nav className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <ul className="flex space-x-4">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                className={`py-2 px-4 rounded-md ${currentIndex === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setCurrentIndex(index)}
              >
                {`Tab ${index + 1}`}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default HeroPage;
