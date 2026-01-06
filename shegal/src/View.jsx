import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingCart, FaShieldAlt, FaTruck, FaMagic } from 'react-icons/fa';
import { CartContext } from './Components/CartContext';

const View = () => {
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0); // Reset scroll position
      try {
        const response = await axios.get(`http://127.0.0.1:8000/store/products/${id}/`);
        setProduct(response.data);
      } catch (err) {
        setError('We couldn’t find the product you’re looking for.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    setAdding(true);
    try {
      // Loop or backend support for multiple quantity
      await axios.post(
        'http://127.0.0.1:8000/store/add-to-cart/',
        { product_id: product.id, quantity: quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      // Success feedback could be a toast notification
    } catch (err) {
      console.error('Add to cart error:', err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-500 text-lg">{error || "Product not found"}</p>
        <button onClick={() => navigate('/store')} className="text-rose-600 font-bold underline">Return to Store</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/store')} 
          className="flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square rounded-[3rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-2xl shadow-rose-100/50"
          >
            <img 
              src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Product Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-6 lg:py-4"
          >
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest mb-4">
                {product.category || 'Premium Skin Care'}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-gray-900 mt-4">${product.price}</p>
            </div>

            <div className="space-y-4 border-t border-b border-gray-100 py-6">
              <h3 className="font-bold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "Indulge in our premium formula designed to nourish and rejuvenate your skin. Crafted with ethically sourced ingredients for visible, lasting results."}
              </p>
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <FaMagic className="text-rose-400" />
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Best For</p>
                  <p className="text-sm font-bold text-gray-700 capitalize">{product.for_type || 'All Skin Types'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <FaShieldAlt className="text-rose-400" />
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold">Brand</p>
                  <p className="text-sm font-bold text-gray-700 capitalize">{product.brand || 'Shegal Exclusive'}</p>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden h-14 w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-6 py-2 hover:bg-gray-100 transition-colors font-bold text-xl"
                > - </button>
                <span className="px-6 py-2 font-bold w-16 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-6 py-2 hover:bg-gray-100 transition-colors font-bold text-xl"
                > + </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 w-full h-14 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
              >
                <FaShoppingCart />
                {adding ? "Adding to bag..." : "Add to Bag"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4 text-gray-400">
              <div className="flex items-center gap-2 text-xs">
                <FaTruck className="text-rose-300" />
                Free Shipping Over $50
              </div>
              <div className="flex items-center gap-2 text-xs">
                <FaShieldAlt className="text-rose-300" />
                Authenticity Guaranteed
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default View;