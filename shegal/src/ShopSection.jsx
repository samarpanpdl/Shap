import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from './Components/CartContext'; // Adjust path if necessary

const ShopSection = ({ products = [] }) => {
  const { fetchCart } = useContext(CartContext);
  const [loadingId, setLoadingId] = useState(null);

  // --- Add To Cart Function ---
  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      alert("Please login to add products to your cart.");
      return;
    }

    setLoadingId(productId); // Start loading for this specific button
    try {
      await axios.post(
        'http://127.0.0.1:8000/store/add-to-cart/',
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the global cart state
      if (fetchCart) fetchCart();
      
      // Optional: Success feedback (Toast or Alert)
      console.log("Product added successfully");
    } catch (err) {
      console.error('Add to cart error:', err);
      alert("Failed to add product to cart.");
    } finally {
      setLoadingId(null); // Stop loading
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="shop" className="bg-gray-50 py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-800"
          >
            Our Recent <span className="text-rose-500 italic uppercase">Clicks</span>
          </motion.h2>
          <div className="h-1.5 w-24 bg-rose-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Product Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                <img 
                  src={`http://127.0.0.1:8000${product.image}`} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Beauty+Product'; }}
                />
                
                {/* Overlay with Quick View Link */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <Link 
                     to={`/products/${product.id}`}
                     className="bg-white p-4 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-12"
                   >
                     <FaEye size={20} />
                   </Link>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-rose-500 font-bold">
                    {product.brand || "SHEGAL Premium"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {product.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-2xl font-light text-gray-800 mb-6">
                  ${product.price}
                </p>

                {/* Add to Cart Button */}
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={loadingId === product.id}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${
                    loadingId === product.id 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gray-900 text-white hover:bg-rose-600 shadow-rose-200"
                  }`}
                >
                  {loadingId === product.id ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {products.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-xl font-light italic">No products currently available in this collection.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;