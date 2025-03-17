const mongoose = require("mongoose");

// Define the Booking Schema
const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package reference is required"],
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "Number of people must be at least 1"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
    },
    userPhone: {
      type: String,
      required: [true, "User phone number is required"],
    },
    userAddress: {
      type: String,
      required: [true, "User address is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Rejected"], // ✅ Removed duplicate "pending"
      default: "Pending",
    },
    transactionId: {
      type: String,
      sparse: true,
      default: null,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
  },
  { timestamps: true }
);

// ✅ Function to Reject a Booking (Admin Only)
BookingSchema.statics.rejectBooking = async function (bookingId) {
  const booking = await this.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // ✅ Correct the case of "Rejected" to match the enum
  booking.status = "Rejected"; 
  await booking.save();

  return { message: "Booking has been rejected successfully" };
};

// ✅ Function to Confirm a Booking
BookingSchema.statics.confirmBooking = async function (bookingId) {
  const booking = await this.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  // ✅ Correct the case of "Confirmed" to match the enum
  booking.status = "Confirmed"; 
  await booking.save();

  return { message: "Booking has been confirmed successfully" };
  
};

// Create the Booking model
const Booking = mongoose.model("Booking", BookingSchema);

// Export the model
module.exports = Booking;
