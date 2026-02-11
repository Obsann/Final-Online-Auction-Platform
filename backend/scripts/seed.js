require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db");
const User = require("../models/User");
const Item = require("../models/itemsModel");
const Auction = require("../models/AuctionsModel");

(async () => {
  await connectDB();

  // Find or create a test user
  let user = await User.findOne({ email: "bidder@example.com" });
  if (!user) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    user = await User.create({
      username: "testbidder",
      email: "bidder@example.com",
      password: hashedPassword,
      role: "buyer",
      status: "approved",
    });
    console.log("✅ Created new user");
  } else {
    console.log("✅ Using existing user");
  }

  // Create new item with timestamp to avoid duplicates
  const timestamp = Date.now();
  const item = await Item.create({
    sellerId: user._id,
    title: `Test Car ${timestamp}`,
    description: "A test car item for seeding",
    category: "vehicles",
    startingPrice: 9000,
    status: "approved",
  });

  // Create auction for the item
  const now = new Date();
  const auction = await Auction.create({
    itemId: item._id,
    startTime: now,
    endTime: new Date(now.getTime() + 3600_000),
    status: "ongoing",
    finalPrice: item.startingPrice,
  });

  console.log("🎯 Test Data Created:");
  console.log(`   User ID: ${user._id.toString()}`);
  console.log(`   Item ID: ${item._id.toString()}`);
  console.log(`   Auction ID: ${auction._id.toString()}`);
  console.log(`\n📡 Test this endpoint in Postman:`);
  console.log(`   GET http://localhost:5000/api/bids/highest/${item._id.toString()}`);

  await mongoose.connection.close();
  process.exit(0);
})();
