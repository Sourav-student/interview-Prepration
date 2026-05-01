"use client";
import axios from 'axios';
import React, { useState } from 'react';

type formDataType = {
  username: string;
  name: string;
  phone_no: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [formData, setFormData] = useState<formDataType>({
    username: "",
    password: "",
    phone_no: "",
    name: "",
    email: ""
  });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, formData);
      alert(res.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-black via-gray-900 to-gray-800 text-white p-4">
      {/* Container */}
      <div className="w-full max-w-lg backdrop-blur-lg p-6 bg-black/40 rounded-2xl border border-gray-700 shadow-2xl max-sm:mt-10">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Start your Journey with <span className="text-blue-500">PrepTrack</span>
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          
          {/* 2-Column Grid to reduce height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Name Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="name">Name</label>
              <input
                id="name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
                type="text"
                placeholder="Sourav Kumar"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Username Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="username">Username</label>
              <input
                id="username"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
                type="text"
                placeholder="sourav_123"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
              <input
                id="email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
                type="email"
                placeholder="sourav@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300" htmlFor="phone_no">Phone Number</label>
              <input
                id="phone_no"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
                type="tel"
                placeholder="1234567890"
                value={formData.phone_no}
                onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password Field (Spans full width at the bottom) */}
          <div className="flex flex-col gap-1 mt-4">
            <label className="text-sm font-medium text-gray-300" htmlFor="password">Password</label>
            <input
              id="password"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-500"
              type="password" /* Fixed type to hide text */
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {/* Styled Submit Button */}
          <button 
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2.5 rounded-lg transition-all text-sm shadow-md"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;