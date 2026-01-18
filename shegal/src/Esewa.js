import React, { useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useNavigate } from 'react-router-dom'; // Assuming you use react-router

export default function Esewa({ formData }) { // Assuming formData comes from props
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/cart');
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    // Define the async function inside the effect
    const processOrder = async () => {
      try {
        // 1. Save shipping info
        await axios.post("http://127.0.0.1:8000/store/ship/", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 2. Confirm Order
        await axios.post("http://127.0.0.1:8000/store/api/confirm-order/", { method: 'COD' }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Navigate on success
        navigate('/', { state: { method: 'COD', success: true } });
      } catch (error) {
        console.error("Order processing error:", error);
        alert("Failed to process COD order.");
      }
    };

    if (token) {
      processOrder();
    }
  }, [navigate, formData]); // Dependencies: runs when these change (usually once on mount)

  return (
    <div style={{ textAlign: 'center', padding: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #10b981 0%, #ec4899 100%)' }}>
      <div style={{ animation: 'bounce 1s infinite', fontSize: '60px', marginBottom: '20px' }}>
        ✓
      </div>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '10px' }}>Processing...</h1>
      <p style={{ color: '#f0f0f0', fontSize: '18px', marginBottom: '30px' }}>Please wait while we confirm your order.</p>
      <button 
        onClick={handleGoBack} 
        style={{ 
          padding: '12px 30px', 
          fontSize: '16px',
          backgroundColor: '#fff',
          color: '#10b981',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
        onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'; }}
        onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}
      >
        Go Back
      </button>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}