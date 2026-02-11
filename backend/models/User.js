const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    bankStatement: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: "pending",
    },
    // User role for access control
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
    // Removed unbounded arrays (auctionsCreated, bidsPlaced) for scalability
    // Access these via queries on the Auction/Bid models instead.
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
