import React, { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from './Components/CartContext';

const QuantityInput = ({ item }) => {
  const { fetchCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(item.quantity);

  // const handleChange = async (e) => {
  //   const newQuantity = parseInt(e.target.value, 10);
  //   const token = localStorage.getItem("access_token");

  //   if (newQuantity === quantity + 1 || newQuantity === quantity - 1) {
  //     try {
  //       if (newQuantity < 1) {
  //         await axios.delete(
  //           `http://127.0.0.1:8000/store/order-items/${item.id}/`,
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //       } else {
  //         await axios.patch(
  //           `http://127.0.0.1:8000/store/order-items/${item.id}/`,
  //           { quantity: newQuantity },
  //           { headers: { Authorization: `Bearer ${token}` } }
  //         );
  //       }
  //       setQuantity(newQuantity);
  //       fetchCart();
  //     } catch (err) {
  //       console.error("Failed to update quantity:", err);
  //     }
  //   } else {
  //     // ignore typing or invalid changes
  //     setQuantity(quantity);
  //   }
  // };

  return (
    <input
      type="number"
      min="0"
      value={quantity}
      // onChange={handleChange}
    />
  );
};

export default QuantityInput;
