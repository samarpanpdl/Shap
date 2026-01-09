
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaPhone, FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
    phone_number: '',
  });
 const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
  
 };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateEmail(formData.email)) {
       alert("Please enter a valid email address structure.");
       return;
      }
    try {
      await axios.post('http://127.0.0.1:8000/user/api/register/', formData);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      // Capture specific field errors if backend sends them, otherwise generic
      const backendError = err.response?.data;
      setError(backendError?.message || backendError?.detail || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-2xl w-full space-y-8 bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl border border-white/20 my-10"
      >
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Create <span className="text-rose-600 italic">Account</span>
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-medium uppercase tracking-widest">
            Join the SHEGAL Beauty Community
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-700 text-sm rounded-r-lg"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div className="relative">
              <FaUser className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-4 left-4 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* First Name */}
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            />

            {/* Last Name */}
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            />

            {/* Email */}
            <div className="relative md:col-span-2">
              <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute top-4 left-4 text-gray-400" />
              <input
                type="number"
                name="phone_number"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-4 bg-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all active:scale-95 mt-6 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Register Account <FaArrowRight />
              </>
            )}
          </button>

          <div className="pt-4 text-center border-t border-gray-100">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-rose-600 font-bold hover:underline">
                Login now
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;