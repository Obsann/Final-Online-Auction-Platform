const axios = require("axios");
const Payment = require("../models/paymentModel");
const Auction = require("../models/AuctionsModel");
const User = require("../models/User");

// --- Initiate Payment with Chapa ---
exports.initiatePayment = async (req, res) => {
  try {
    const { auctionId, method } = req.body;
    const userId = req.user.id;

    // Validate auction
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== "completed") {
      return res.status(400).json({ message: "Auction not closed or invalid" });
    }
    if (auction.winnerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the winner can pay" });
    }

    // Get user details for payment
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create payment record in DB
    const payment = await Payment.create({
      auctionId,
      payerId: userId,
      amount: auction.finalPrice,
      method: method || "card",
      status: "pending",
    });

    // Call Chapa API
    const tx_ref = "txn_" + Date.now();
    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: String(auction.finalPrice),
        currency: "ETB",
        email: user.email,
        first_name: user.username,
        tx_ref,
        callback_url: process.env.CHAPA_CALLBACK_URL || "http://localhost:5000/api/payments/chapa/callback",
        return_url: process.env.CHAPA_RETURN_URL || "http://localhost:3000",
        "customization[title]": "Auction Payment",
        "customization[description]": `Payment for auction ${auctionId}`,
      },
      {
        headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
      }
    );

    if (response.data.status === "success") {
      payment.transactionId = tx_ref;
      await payment.save();
      return res.json({
        message: "Payment initiated",
        checkoutUrl: response.data.data.checkout_url,
        payment,
      });
    } else {
      return res.status(400).json({ message: "Chapa initialization failed" });
    }
  } catch (err) {
    console.error("[initiatePayment]", err.message);
    res.status(500).json({ message: err.message });
  }
};

// --- Handle Chapa Callback ---
exports.chapaCallback = async (req, res) => {
  try {
    const { tx_ref, status } = req.query;
    const payment = await Payment.findOne({ transactionId: tx_ref });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = status === "success" ? "completed" : "failed";
    await payment.save();

    return res.json({ message: "Payment updated", payment });
  } catch (err) {
    console.error("[chapaCallback]", err);
    res.status(500).json({ message: err.message });
  }
};

// --- Get Payment Status ---
exports.getPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.json({
      id: payment._id,
      status: payment.status,
      method: payment.method,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Payment History ---
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ payerId: req.user.id }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
