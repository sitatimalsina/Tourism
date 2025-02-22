const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const roles = ["user", "admin", "service_provider"];

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"]
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, "Please fill a valid phone number"]
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  role: {
    type: String,
    enum: roles,
    default: "user"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  preferences: {
    interests: {
      type: [String],
      default: []
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
