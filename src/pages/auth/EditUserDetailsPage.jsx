import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function EditDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({
    fullName: "",
    country: "",
    address: "",
    dateOfBirth: "",
    phoneNumber: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (location.state && location.state.userDetails) {
      setUser(location.state.userDetails);
      setLoading(false);
    } else {
      axios
        .get(`${process.env.REACT_APP_BASE_API}/users/${userId}/details`)
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setError(error);
          setLoading(false);
        });
    }
  }, [userId, location.state]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      axios
        .post(`${process.env.REACT_APP_BASE_API}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const imageName = response.data; // Assuming backend returns the filename
          const updatedUser = { ...user, image: imageName };

          return axios.put(
            `${process.env.REACT_APP_BASE_API}/users/${userId}/details`,
            updatedUser
          );
        })
        .then(() => {
          alert("User details updated successfully!");
          navigate(`/profile`);
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          alert("Failed to update user details. Please try again later.");
        });
    } else {
      axios
        .put(`${process.env.REACT_APP_BASE_API}/users/${userId}/details`, user)
        .then(() => {
          alert("User details updated successfully!");
          navigate(`/profile`);
        })
        .catch((error) => {
          console.error("Error updating user details:", error);
          alert("Failed to update user details. Please try again later.");
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <p className="text-xl font-semibold mb-4">
            Error loading user details
          </p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => navigate(`/profile`)}
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Edit Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Country</label>
            <input
              type="text"
              name="country"
              value={user.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={user.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 font-semibold">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          {user.image && (
            <div className="mb-4">
              <img
                src={`${process.env.REACT_APP_IMAGES_URL}/${user.image}`}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto"
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate(`/profile`)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDetailsPage;
