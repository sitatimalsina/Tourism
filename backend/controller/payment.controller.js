const axios = require("axios");
const Booking = require("../model/Booking");

console.log("Processing Khalti payment response..."); // Debugging log
// Process Khalti Payment Response

const processKhaltiPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    // Verify the payment with Khalti
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { status, transaction_id, total_amount } = khaltiResponse.data;
    console.log(`Khalti response status: ${status}, transaction_id: ${transaction_id}, total_amount: ${total_amount}`); // Debugging log


    if (status === "Completed") {
      // Confirm the payment in the database
      const paymentDetails = { transaction_id, total_amount };
      const booking = await Booking.findOneAndUpdate(
        { _id: transaction_id }, // Assuming transaction_id matches the booking ID
        {
          paymentStatus: "paid",
          paymentDetails,
          status: "confirmed",
        },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ error: "Booking not found for the given transaction ID" });
      }

      return res.status(200).json({ success: "Payment confirmed successfully!", booking });
    } else {
      return res.status(400).json({ error: "Payment failed or was not completed" });
    }
  } catch (error) {
    console.error("Error processing Khalti payment:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { processKhaltiPayment };
