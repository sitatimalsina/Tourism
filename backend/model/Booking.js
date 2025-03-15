const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
      index: true,
    },
    numberOfPeople: {
      type: Number,
      required: [true, "Number of people is required"],
      min: [1, "At least one person is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
      validate: {
        validator: function (value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to compare only dates
          return value >= today; // Ensures booking date is today or in the future
        },
        message: "Booking date cannot be in the past",
      },
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    userPhone: {
      type: String,
      required: [true, "User phone number is required"],
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    userAddress: {
      type: String,
      required: [true, "User address is required"],
      trim: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "rejected"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", "cash"],
      default: "khalti",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
      index: true,
    },
    paymentDetails: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true }
);

/** Virtual Property: Get full user info */
BookingSchema.virtual("fullUserInfo").get(function () {
  return `${this.userName} (${this.userEmail}, ${this.userPhone})`;
});

/** Virtual Property: Calculate Total Amount */
BookingSchema.virtual("totalAmount").get(function () {
  return this.package.price * this.numberOfPeople; // Assuming `package.price` is populated
});

/** Static Method: Update Booking Status */
BookingSchema.methods.updateStatus = async function (newStatus) {
  this.status = newStatus;
  await this.save();
  return this;
};



/** Static Method: Reject Booking */
BookingSchema.statics.rejectBooking = async function (bookingId) {
  const booking = await this.findById(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }
  booking.status = "rejected";
  await booking.save();
  return booking;
};

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;