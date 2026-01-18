import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [isCodLoading, setIsCodLoading] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      setIsCodLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        // If payment gateway sends encoded data
        const dataQuery = search.get("data");
        if (dataQuery) {
          const parsedData = JSON.parse(atob(dataQuery));
          setData(parsedData);
        }

        // Confirm order in backend
        await axios.post(
          "http://127.0.0.1:8000/store/api/confirm-order/",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate("/", { state: { method: "ONLINE" } });
      } catch (error) {
        console.error("Payment Error:", error);
        alert("Failed to confirm payment.");
      } finally {
        setIsCodLoading(false);
      }
    };

    processPayment();
  }, [search, navigate]);

  return (
    <div className="payment-container">
      <img src="/check.png" alt="Success" />
      <p className="price">Rs. {data?.total_amount}</p>
      <p className="status">
        {isCodLoading ? "Processing Payment..." : "Payment Successful"}
      </p>
    </div>
  );
};

export default PaymentSuccess;
