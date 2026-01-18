import React from 'react';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Homepage from './Homepage';
import Store from './Store';
import Register from './Register';
import Login from './Login';
import Cart from './Cart';
import View from './View';
import { CartProvider } from './Components/CartContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './Chatbot';
import Shippingpage from './Shippingpage';
import PaymentSuccess from './PaymentSuccess';
import Payment from './Payment';
import axios from 'axios';
import { useEffect } from 'react';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Esewa from './Esewa';

const API_URL = "http://localhost:8000";

function App() {
  // useEffect(() => {
    // Set withCredentials globally to ensure the cookie is received
  //   axios.defaults.withCredentials = true; 

  //   // Initial GET request to force Django to set the cookie
  //   axios.get(`${API_URL}/api/set-csrf/`) 
  //     .catch(error => console.error("Failed to ensure CSRF cookie:", error));
  // }, []);
  axios.defaults.baseURL = 'http://127.0.0.1:8000';
  axios.defaults.withCredentials = false;
  return (<>
    <CartProvider>
      
     <BrowserRouter>
    <Navbar />
      <Routes>
      <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/store" element={<Store />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/products/:id/' element={<View/>}/>
        <Route path='/shipping' element={<Shippingpage/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/esewa" element ={<Esewa/>}/>
      </Routes>
    </BrowserRouter>
    <Footer /> 
    </CartProvider>
    <Chatbot/> 
    
    
    
 
    </>
  );
}

export default App;
