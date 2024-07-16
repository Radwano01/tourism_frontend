import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    image: null,
    fullName: '',
    country: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });

  const navigate = useNavigate();

  const DEFAULT_USER_IMAGE = `${process.env.DEFAULT_USER_IMAGE}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.image ? '' : DEFAULT_USER_IMAGE;

    if (formData.image) {
      const imageData = new FormData();
      imageData.append('file', formData.image);
      
      try {
        const uploadResponse = await axios.post(`${process.env.REACT_APP_BASE_API}/image`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        return; // Exit function if image upload fails
      }
    }

    const userFormData = {
      ...formData,
      image: imageUrl
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API}/users/register`, userFormData);
      if(response){
        navigate("/login");
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-gray-700">Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              accept="image/*"
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-gray-700">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-700">Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number:</label>
            <input
              type="number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Phone Number"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Address"
              required
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block text-gray-700">Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full px-3 py-2 bg-blue-500 text-white rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;