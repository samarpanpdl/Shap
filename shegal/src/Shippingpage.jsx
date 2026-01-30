import React, { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTruck, FaMoneyBillWave } from 'react-icons/fa';
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { CartContext } from './Components/CartContext';

const ShippingPage = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const esewaFormRef = useRef(null); // Ref for programmatically submitting the hidden form

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
    // Ensure these URLs match your actual frontend routes
    success_url: "http://localhost:3000/esewa",
    failure_url: "https://developer.esewa.com.np/failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q", 
  });

  const totalCartAmount = cart.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  const handleCodeSubmit = async () => {
  // 1. Validation
    if (!formData.address || !formData.city || !formData.state) {
      alert("Please fill in all shipping fields first.");
      return;
    }

    // 2. Simply navigate to the success/process page
    // We pass the formData in the 'state' object
    navigate('/esewa', { 
      state: { 
        method: 'COD', 
        success: true, 
        shippingData: formData // This is the key part
      } 
    });
};
  // 1. Sync Amount from Cart
  useEffect(() => {
    const amountStr = totalCartAmount.toString();
    setPaymentData(prev => ({
      ...prev,
      amount: amountStr,
      total_amount: amountStr, // eSewa v2 requires total_amount = amount + tax + service + delivery
    }));
  }, [totalCartAmount]);

  // 2. Generate Signature (Must match the hidden input values exactly)
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = paymentData;
    
    // The format must be exactly: total_amount=X,transaction_uuid=Y,product_code=Z
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(message, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    
    setPaymentData(prev => ({ ...prev, signature: hashedSignature }));
  }, [paymentData.total_amount, paymentData.transaction_uuid, paymentData.product_code, paymentData.secret]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SUBMISSION LOGIC ---

  const handleEsewaSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city) {
        alert("Please fill shipping details first.");
        return;
    }

    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      // Step A: Save shipping info to your Django backend
      await axios.post("http://127.0.0.1:8000/store/ship/", formData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      // Step B: Submit the hidden eSewa form
      if (esewaFormRef.current) {
        esewaFormRef.current.submit();
      }
    } catch (error) {
      console.error("Shipping Save Error:", error);
      alert("Could not save shipping details. Please check your connection.");
      setLoading(false);
    }
  };

  const handleCodSubmit = async () => {
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
      // 2. Confirm Order as COD
      await axios.post("http://127.0.0.1:8000/store/api/confirm-order/", { method: 'COD' }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      navigate('/', { state: { method: 'COD', success: true } });
    } catch (error) {
      alert("Failed to process COD order.");
    } finally {
      setIsCodLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Shipping Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><FaTruck size={24} /></div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
          </div>

          <form onSubmit={handleEsewaSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="State" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none" />
              <input type="text" placeholder="City" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} required className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none" />
              <input type="text" placeholder="Ward" name="ward" value={formData.ward} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
            <input type="text" placeholder="Street Name" name="street" value={formData.street} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none" />

            <div className="space-y-3 pt-6">
              <button type="submit" disabled={loading || isCodLoading} onclick={handleCodeSubmit} className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex justify-center items-center gap-2 shadow-lg">
                {loading ? "Processing..." : "Pay via eSewa"}
              </button>

              <button type="button" onClick={handleCodSubmit} disabled={loading || isCodLoading} className="w-full py-4 bg-white text-gray-800 border-2 border-gray-100 font-bold rounded-2xl hover:bg-gray-50 transition-all flex justify-center items-center gap-2">
                {isCodLoading ? "Saving..." : <><FaMoneyBillWave className="text-gray-500"/> Cash on Delivery</>}
              </button>
            </div>
          </form>

          {/* HIDDEN ESEWA FORM - Triggered via handleEsewaSubmit */}
          <form ref={esewaFormRef} action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className="hidden">
            <input type="hidden" name="amount" value={paymentData.amount} />
            <input type="hidden" name="tax_amount" value="0" />
            <input type="hidden" name="total_amount" value={paymentData.total_amount} />
            <input type="hidden" name="transaction_uuid" value={paymentData.transaction_uuid} />
            <input type="hidden" name="product_code" value={paymentData.product_code} />
            <input type="hidden" name="product_service_charge" value="0" />
            <input type="hidden" name="product_delivery_charge" value="0" />
            <input type="hidden" name="success_url" value={paymentData.success_url} />
            <input type="hidden" name="failure_url" value={paymentData.failure_url} />
            <input type="hidden" name="signed_field_names" value={paymentData.signed_field_names} />
            <input type="hidden" name="signature" value={paymentData.signature} />
          </form>
        </motion.div>

        {/* Right Side: Order Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <button onClick={() => navigate('/cart')} className="text-gray-400 hover:text-rose-600 flex items-center gap-2 transition-colors"><FaArrowLeft size={12}/> Back to Bag</button>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
              {cart.items?.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} className="w-16 h-16 object-cover rounded-xl bg-gray-50" alt={item.name} />
                  <div className="flex-grow">
                    <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-50 mt-6 pt-6 flex justify-between items-center">
              <span className="text-gray-500">Order Total</span>
              <span className="font-bold text-gray-900 text-2xl">Rs. {totalCartAmount.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ShippingPage;