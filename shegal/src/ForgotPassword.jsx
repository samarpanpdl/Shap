import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Add this

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) return alert("Please enter your email");
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/store/api/forgot-password/', { email });
      alert("OTP sent to your email!");
      // Redirect to the Reset Password page and pass the email state if needed
      navigate('/reset-password', { state: { email } }); 
    } catch (err) {
      console.error('Forget password error:', err);
      alert(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <input 
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded mb-4" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <button 
          className="w-full bg-rose-600 text-white py-2 rounded hover:bg-rose-700 transition"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}