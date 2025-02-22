const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "Pending" },
  transactionId: { type: String },
});

module.exports = mongoose.model("Payment", paymentSchema);