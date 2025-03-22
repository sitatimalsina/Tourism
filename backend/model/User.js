const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const roles = ["user", "admin", "service_provider"];

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?.])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?.]{8,}$/;
          return regex.test(value);
        },
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and one special character.",
      },
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    preferences: {
      interests: {
        type: [String],
        default: [],
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    lastPasswordChange: {
      type: Date,
      default: null,
    },
    passwordHistory: {
      type: [String], // Store hashes of previous passwords to prevent reuse
      default: [],
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    // Add new password hash to history
    if (!this.passwordHistory) {
      this.passwordHistory = [];
    }
    this.passwordHistory.push(this.password);

    // Limit password history to last 5 passwords
    if (this.passwordHistory.length > 5) {
      this.passwordHistory = this.passwordHistory.slice(-5);
    }

    // Update lastPasswordChange only if the password is changed
    this.lastPasswordChange = new Date();

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual field to calculate days since last password change
UserSchema.virtual("daysSinceLastPasswordChange").get(function () {
  if (!this.lastPasswordChange) return null;
  const today = new Date();
  const diffTime = Math.abs(today - this.lastPasswordChange);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
});

// Method to update lastLogin
UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Indexes for performance optimization
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ lastPasswordChange: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;
