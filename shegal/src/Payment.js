import React,{useState,useEffect} from 'react'
import { CartContext } from './Components/CartContext';
import { useContext } from 'react';
import {v4 as uuidv4} from "uuid";
import CryptoJS from "crypto-js";

const Payment = () => {
    const { cart, fetchCart } = useContext(CartContext);
    let pricewithdelivery = 0;
    let totalAmount = 0;
     for (let i = 0; i < (cart.items?.length || 0); i++) {
        const item = cart.items[i];
        const price = item.price || 0; // use item.price, not item.product.price
        totalAmount += price * item.quantity;
        pricewithdelivery = totalAmount + 120;
  };
   
   //''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    const [TheFormData, setTheFormData] = useState({
        amount: pricewithdelivery,
        tax_amount: "0",
        total_amount: pricewithdelivery,
        transaction_uuid: uuidv4(),
        product_service_charge: "0",
        product_delivery_charge: "0",
        product_code: "EPAYTEST",
        success_url: "http://localhost:5173/paymentsuccess",
        failure_url: "http://localhost:5173/paymentfailure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: "",
        secret: "8gBm/:&EnhH.1/q",
      });
    
      // generate signature function
      const generateSignature = (
        total_amount,
        transaction_uuid,
        product_code,
        secret
      ) => {
        const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const hash = CryptoJS.HmacSHA256(hashString, secret);
        const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
        return hashedSignature;
      };
    
      // useeffect
      useEffect(() => {
        const { total_amount, transaction_uuid, product_code, secret } = TheFormData;
        const hashedSignature = generateSignature(
          total_amount,
          transaction_uuid,
          product_code,
          secret
        );
    
        setTheFormData({ ...TheFormData, signature: hashedSignature });
      }, [TheFormData.amount]);
  
  
  return (
    <>
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
       <div className="field">
        <input
          type="hidden"
          id="amount"
          name="amount"
          autoComplete="off"
          value={TheFormData.amount}
          onChange={({ target }) =>
            setTheFormData({
              ...TheFormData,
              amount: target.value,
              total_amount: target.value,
            })
          }
          required
        />
      </div>
      <input
        type="hidden"
        id="tax_amount"
        name="tax_amount"
        value={TheFormData.tax_amount}
        required
      />
      <input
        type="hidden"
        id="total_amount"
        name="total_amount"
        value={TheFormData.total_amount}
        required
      />
      <input
        type="hidden"
        id="transaction_uuid"
        name="transaction_uuid"
        value={TheFormData.transaction_uuid}
        required
      />
      <input
        type="hidden"
        id="product_code"
        name="product_code"
        value={TheFormData.product_code}
        required
      />
      <input
        type="hidden"
        id="product_service_charge"
        name="product_service_charge"
        value={TheFormData.product_service_charge}
        required
      />
      <input
        type="hidden"
        id="product_delivery_charge"
        name="product_delivery_charge"
        value={TheFormData.product_delivery_charge}
        required
      />
      <input
        type="hidden"
        id="success_url"
        name="success_url"
        value={TheFormData.success_url}
        required
      />
      <input
        type="hidden"
        id="failure_url"
        name="failure_url"
        value={TheFormData.failure_url}
        required
      />
      <input
        type="hidden"
        id="signed_field_names"
        name="signed_field_names"
        value={TheFormData.signed_field_names}
        required
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
        value={TheFormData.signature}
        required
      />  

      
      
    


    {/* ================================================================================ */}
    <div className='main-container'>
    <div className='left-section'>
        <h3>Select Payment method</h3>
        <button className='bth' value="Pay via E-Sewa" type="submit" >Pay via Esewa</button>
        <button>Cash on Delivery</button>
    </div>
    
    <div className='right-section'>
        <h2>ORDER SUMMARY</h2>
        <hr/>
        <div className='ubox'>
        <span>Order amount: Rs. {totalAmount} <br/></span>
        <span>Delivery charge : Rs. 120 <br/></span>
        </div>
        <hr/>
        <div className='lbox'>
        <span>Total amount : Rs. {pricewithdelivery}</span>
        </div>
    </div>
    </div>
    </form> 
    </>
  )
}

export default Payment;