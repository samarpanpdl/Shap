import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShieldAlt, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { CartContext } from './Components/CartContext';

const ShippingPage = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCodLoading, setIsCodLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    ward: "",
    street: "",
  });


  
  const [paymentData, setPaymentData] = useState({
    amount: "0",
    tax_amount: "0",
    total_amount: "0",
    transaction_uuid: uuidv4(),
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q", 
  });

  const totalCartAmount = cart.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  useEffect(() => {
    setPaymentData(prev => ({
      ...prev,
      amount: totalCartAmount.toString(),
      total_amount: totalCartAmount.toString()
    }));
  }, [totalCartAmount]);

  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = paymentData;
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    setPaymentData(prev => ({ ...prev, signature: hashedSignature }));
  }, [paymentData.total_amount, paymentData.transaction_uuid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- OPTION 1: ESEWA SUBMISSION ---
  const handleEsewaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      await axios.post("http://127.0.0.1:8000/store/ship/", formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      document.getElementById("esewa-form").submit();
    } catch (error) {
      alert("Error saving shipping details.");
      setLoading(false);
    }
  };

  // --- OPTION 2: CASH ON DELIVERY ---
  const handleCodSubmit = async () => {
    // Basic validation check
    if (!formData.address || !formData.city || !formData.state) {
      alert("Please fill in all shipping fields first.");
      return;
    }

    setIsCodLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      // 1. Save shipping info
      await axios.post("http://127.0.0.1:8000/store/ship/", formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // 2. Mark order as COD in your backend
      // Assuming you have an endpoint for this, or just navigate to success
      await axios.post("http://127.0.0.1:8000/store/api/confirm-order/", {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      navigate('/', { state: { method: 'COD' } });
    } catch (error) {
      console.error("COD Error:", error);
      alert("Failed to process COD order.");
    } finally {
      setIsCodLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Shipping Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><FaTruck size={24} /></div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
          </div>

          <form onSubmit={handleEsewaSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-500" />
              <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} required className="col-span-2 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-500" />
              <input type="text" placeholder="Ward" name="ward" value={formData.ward} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <input type="text" placeholder="Street Name" name="street" value={formData.street} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-rose-500" />

            {/* Payment Buttons Container */}
            <div className="space-y-3 pt-4">
              {/* eSewa Button (Main Form Submit) */}
              <button type="submit" disabled={loading || isCodLoading} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg flex justify-center items-center gap-2">
                {loading ? "Redirecting..." : "Pay via eSewa"}
              </button>

              {/* Cash On Delivery Button */}
              <button type="button" onClick={handleCodSubmit} disabled={loading || isCodLoading} className="w-full py-4 bg-white text-gray-800 border-2 border-gray-200 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all flex justify-center items-center gap-2">
                {isCodLoading ? "Saving Order..." : <><FaMoneyBillWave className="text-gray-500"/> Cash on Delivery</>}
              </button>
            </div>
          </form>

          {/* Hidden eSewa Form */}
          <form id="esewa-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input type="hidden" name="amount" value={paymentData.amount} /><input type="hidden" name="tax_amount" value={paymentData.tax_amount} /><input type="hidden" name="total_amount" value={paymentData.total_amount} /><input type="hidden" name="transaction_uuid" value={paymentData.transaction_uuid} /><input type="hidden" name="product_code" value={paymentData.product_code} /><input type="hidden" name="product_service_charge" value="0" /><input type="hidden" name="product_delivery_charge" value="0" /><input type="hidden" name="success_url" value={paymentData.success_url} /><input type="hidden" name="failure_url" value={paymentData.failure_url} /><input type="hidden" name="signed_field_names" value={paymentData.signed_field_names} /><input type="hidden" name="signature" value={paymentData.signature} />
          </form>
        </motion.div>

        {/* Right: Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <button onClick={() => navigate('/cart')} className="text-gray-500 hover:text-rose-600 font-medium flex items-center gap-2"><FaArrowLeft size={12}/> Back to Bag</button>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="max-h-60 overflow-y-auto space-y-4 mb-6">
              {cart.items?.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} className="w-16 h-16 object-cover rounded-xl" alt={item.name} />
                  <div className="flex-grow"><p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p><p className="text-xs text-gray-400">Qty: {item.quantity}</p></div>
                  <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between"><span>Total</span><span className="font-bold text-gray-900 text-xl">${totalCartAmount}</span></div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ShippingPage;