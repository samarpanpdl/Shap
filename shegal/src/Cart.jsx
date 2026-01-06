// import './Cart.css'
// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { CartContext } from './Components/CartContext';
// import { Link,useNavigate } from 'react-router-dom';
// import QuantityInput from './Components/QuantityInput';
// const Cart = () => {
//   const { cart, fetchCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   // Navigate to home
//   const goToHome = () => {    
//     navigate('/');
//   }
  
//   const AddToCart = async (productId) => {
//     const token = localStorage.getItem('access_token');
//     try {
//       await axios.post(
//         'http://127.0.0.1:8000/store/add-to-cart/',
//         { product_id: productId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchCart();
//     } catch (err) {
//       console.error('Add to cart error:', err);
//     }
//   };

//   const RemoveFromCart = async (productId) => {
//     const token = localStorage.getItem('access_token');
//     try {
//       await axios.post(
//         'http://127.0.0.1:8000/store/remove_from-cart/',
//         { product_id: productId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchCart();
//     } catch (err) {
//       console.error('Add to cart error:', err);
//     }
//   };
//   // Fetch cart items on component mount
//   useEffect(() => {
//     fetchCart(); // updates cart in context
//   }, [fetchCart]);

//   // Calculate total amount
//   let totalAmount = 0;
//   for (let i = 0; i < (cart.items?.length || 0); i++) {
//     const item = cart.items[i];
//     const price = item.price || 0; // use item.price, not item.product.price
//     totalAmount += price * item.quantity;
//   };
  
     
  
//   return (
//     <div className='card-container'>
//       <div className='card'>
//         <div className='upper-card'>
//           <button onClick={goToHome}>Continue Shopping</button>
//         </div>
//         <hr/>
//         <div className='lower-card'>
//           <table className="table">
//             <tbody>
//               <tr>
//                 <td><h5>Items: <strong>{cart.cart_items || 0}</strong></h5></td>
//                 <td><h5>Total: <strong>${totalAmount}</strong></h5></td>
//                 {/* <td>
//                   <Link to="/shipping" className="btn btn-success">Checkout</Link>
//                 </td> */}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className='card scroll-container'>
//         <table className="table cart-table">
//   <thead>
//     <tr>
//       <th>Item</th>
//       <th>Price</th>
//       <th>Quantity</th>
//       <th>Total</th>
//     </tr>
//   </thead>
//   <tbody>
//     {cart.items?.length === 0 ? (
//       <tr>
//         <td colSpan="4">Your cart is empty.</td>
//       </tr>
//     ) : (
//       cart.items.map((item) => (
//         <tr key={item.id}>
//           <td>
//             {item.name || "Unknown Product"}
//             <br />
//             <img
//               src={item.image} alt={item.name || "Product"}
//               style={{ width: "50px", marginTop: "5px" }}
//             />
//           </td>
//           <td>${item.price || 0}</td>
//           <td> <button className='mathbtn' onClick={() => RemoveFromCart(item.id)}>-</button>  {item.quantity} <button className='mathbtn' onClick={() => AddToCart(item.id)}>+</button> </td> 
//           <td>${(item.price || 0) * item.quantity}</td>
//         </tr>
//       ))
//     )}
//   </tbody>
// </table>
      
        
//         </div>
//            <div className='lowone'>
//           <button><Link to="/shipping" className="btn btn-success">Checkout</Link></button>
          
//         </div>
//         </div>
    
//   );
// };

// export default Cart;
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa';
import { CartContext } from './Components/CartContext';

const Cart = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Handle quantity changes with loading feedback
  const updateQuantity = async (productId, action) => {
    const token = localStorage.getItem('access_token');
    const endpoint = action === 'add' ? 'add-to-cart/' : 'remove_from-cart/';
    
    setIsUpdating(productId);
    try {
      await axios.post(
        `http://127.0.0.1:8000/store/${endpoint}`,
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error('Update quantity error:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  const totalAmount = cart.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Your Shopping Bag</h1>
            <p className="text-gray-500 mt-1">{cart.cart_items || 0} items in your bag</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors"
          >
            <FaArrowLeft size={14} /> Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode='popLayout'>
              {cart.items?.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-3xl text-center shadow-sm"
                >
                  <p className="text-gray-400 text-lg mb-6">Your bag is currently empty.</p>
                  <Link to="/store" className="bg-rose-600 text-white px-8 py-3 rounded-full font-bold">Browse Products</Link>
                </motion.div>
              ) : (
                cart.items.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-4 md:gap-6 items-center"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 text-lg">{item.name || "Product"}</h3>
                      <p className="text-rose-500 font-medium">${item.price}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(item.id, 'remove')}
                        className="p-2 hover:bg-white hover:text-rose-500 rounded-xl transition-all disabled:opacity-30"
                        disabled={isUpdating === item.id}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-4 text-center font-bold text-gray-700">
                        {isUpdating === item.id ? "..." : item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 'add')}
                        className="p-2 hover:bg-white hover:text-rose-500 rounded-xl transition-all disabled:opacity-30"
                        disabled={isUpdating === item.id}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="hidden md:block text-right min-w-[80px]">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <hr className="border-gray-50" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/shipping" 
                className={`block text-center w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  cart.items?.length > 0 
                  ? "bg-gray-900 text-white hover:bg-rose-600 shadow-rose-100" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout
              </Link>
              
              <p className="text-center text-xs text-gray-400 mt-4">
                Secure checkout with encrypted payments
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;