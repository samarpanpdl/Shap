import axios from "axios";
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize email from the previous step if available
  const [data, setData] = useState({
    email: location.state?.email || "", 
    otp: "",
    new_password: "",
  });

  const resetPassword = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/store/api/reset-password/', data);
      alert("Password reset successfully! Please login.");
      navigate('/login'); // Redirect to login
    } catch (err) {
      console.error('Reset error:', err);
      alert(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        <input 
          placeholder="Email" 
          className="w-full p-2 border rounded"
          value={data.email}
          onChange={e => setData({...data, email: e.target.value})} 
        />
        <input 
          placeholder="OTP Code" 
          className="w-full p-2 border rounded"
          onChange={e => setData({...data, otp: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="New Password"
          className="w-full p-2 border rounded"
          onChange={e => setData({...data, new_password: e.target.value})} 
        />
        <button 
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={resetPassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}