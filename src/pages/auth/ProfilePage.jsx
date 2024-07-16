import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios
        .get(
          `${process.env.REACT_APP_BASE_API}/users/${parsedUser.userId}/details`
        )
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleVerifyEmail = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axios
        .post(
          `${process.env.REACT_APP_BASE_API}/users/verification/users/${parsedUser.userId}/${parsedUser.accessToken}`
        )
        .then(() => {
          setUser((prevUser) => ({ ...prevUser, verificationStatus: true }));
          alert("check your Email!");
        })
        .catch((error) => {
          console.error("Error verifying email:", error);
          alert("Failed to verify email. Please try again later.");
        });
    }
  };

  const handleDeleteProfile = () => {
    if (window.confirm("Are you sure you want to delete your profile?")) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        axios
          .delete(
            `${process.env.REACT_APP_BASE_API}/users/${parsedUser.userId}`
          )
          .then(() => {
            localStorage.removeItem("user");
            navigate("/login");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            alert("Failed to delete profile. Please try again later.");
          });
      }
    }
  };

  const handleEditDetails = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    navigate(`/edit-user-details/${parsedUser.userId}`, { state: { user: parsedUser } });
  };

  const handleResetPassword = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    navigate(`/reset-password/${parsedUser.userId}`);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
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
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <p className="text-xl font-semibold mb-4">User not found</p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center mb-4">
        <div className="flex items-center justify-start mb-4">
          <button
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            {"<"} Back
          </button>
        </div>
        <div className="mb-4">
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/${user.image}`}
            alt={user.username}
            className="w-24 h-24 bg-gray-300 rounded-full mx-auto"
          />
        </div>
        <p className="text-2xl font-semibold mb-2">{user.username}</p>
        <p className="text-gray-600 mb-4">{user.fullName}</p>
        <div className="text-left mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Country:</span> {user.country}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Phone Number:</span>{" "}
            {user.phoneNumber}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Address:</span> {user.address}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Date of Birth:</span>{" "}
            {formatDate(user.dateOfBirth)}
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center space-x-4">
        {!user.verificationStatus && (
          <button
            className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200"
            onClick={handleVerifyEmail}
          >
            Verify Email
          </button>
        )}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          onClick={handleEditDetails}
        >
          Edit Details
        </button>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
          onClick={handleDeleteProfile}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;