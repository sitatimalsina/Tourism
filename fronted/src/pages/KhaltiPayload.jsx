import React, { useState } from "react";
import axios from "axios";

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleKhaltiPayment = async (bookingData) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/bookings", bookingData);

      const { khaltiPayload } = response.data;

      // Initialize Khalti payment
      const khaltiConfig = {
        publicKey: process.env.REACT_APP_KHALTI_PUBLIC_KEY,
        productIdentity: khaltiPayload.purchase_order_id,
        productName: khaltiPayload.purchase_order_name,
        productUrl: khaltiPayload.website_url,
        eventHandler: {
          onSuccess(payload) {
            // Send Khalti's response to the backend for confirmation
            axios.post("/api/payments/complete-payment", { transactionId: payload.idx })
              .then(() => alert("Payment successful!"))
              .catch((err) => console.error(err));
          },
          onError(error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
          },
        },
        paymentPreference: ["KHALTI"],
      };

      const khaltiCheckout = new window.KhaltiCheckout(khaltiConfig);
      khaltiCheckout.show({ amount: khaltiPayload.amount });
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={() => handleKhaltiPayment({ /* booking data */ })} disabled={loading}>
        {loading ? "Processing..." : "Pay with Khalti"}
      </button>
    </div>
  );
};

export default Checkout;