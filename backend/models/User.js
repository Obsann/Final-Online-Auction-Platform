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
    // optional: admin role for system-level access
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Auctions this user created as seller
    auctionsCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
      }
    ],
    //seller auction
     sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
    // Auctions this user has placed bids on
    bidsPlaced: [
      {
        auctionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Auction",
        },
        amount: Number,
        time: { type: Date, default: Date.now }
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
