// server.js

// 1. Load environment variables
const dotenv = require('dotenv');
dotenv.config(); // Reads .env file

// 2. Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const winston = require('winston'); // For logging

const connectDB = require('./config/db'); // Your db.js file
const itemRoutes = require('./routes/itemRoutes'); // Item API routes
const auctionRoutes = require('./routes/auctionRoutes'); // Auction API routes
const notificationsRoute = require('./routes/notification');
const path = require("path");
const checkAuctions = require('./services/auctionCron')


const http = require('http')

// 3. Initialize Express app
const app = express();

// --- Security Middleware ---

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// 4. Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow config via env
  credentials: true,
}));
app.use(express.json({ limit: '10kb' })); // Body limit is checking against DoS

// 5. Optional: simple request logger (replaced with Winston later if needed, keeping simple for now)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 6. Connect to MongoDB
connectDB(); // logs success or exits if fails

// 7. Mount API routes
app.use("/api/items", itemRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", require("./routes/bidRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/test", require("./routes/testRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/admin', require("./routes/adminRoutes"))
app.use('/api/notifications', notificationsRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
setInterval(checkAuctions, 60 * 1000);


// 8. Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Auction API is running..." });
});

// --- Chatbot REST endpoint ---
app.get("/chatbot", (req, res) => {
  res.send("Auction Buddy Backend running 🚀");
});


// 9. Global error handler
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

// 10. Start the server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// --- WebSocket Server for Chatbot ---
const { WebSocketServer } = require("ws");

// Attach WebSocket to the SAME server (port 5000)
const wss = new WebSocketServer({ server });

const faq = {
  bid: "💡 To place a bid, enter your amount on the item page. Highest bid wins when auction ends.",
  payment: "💳 Payments: Telebirr, Chapa, or Bank transfer.",
  telebirr: "📲 Telebirr: mobile payments, instant confirmation.",
  chapa: "💸 Chapa: online payments for local businesses.",
  bank: "🏦 Bank transfer: standard 24h processing.",
  reminder: "⏰ You can set reminders for auction closing or outbid alerts.",
  rules: "📜 Auction rules: 1) Highest bid wins, 2) Payment in 24h, 3) No withdrawals.",
  outbid: "⚠️ Outbid alert: you’ll be notified instantly.",
  closing: "⌛ Auctions closing soon! Place final bids.",
  help: "🙋 Ask me about: 'How do I bid?', 'Payment options', 'Auction rules', 'Cars under 10k', 'Reminders', 'Outbid alerts'.",
};

wss.on("connection", (ws) => {
  console.log("🔌 Chatbot client connected!");
  ws.send("Welcome to Auction Buddy! 🤖 Ask about bidding, payments, cars, rules, or reminders.");

  ws.on("message", (msg) => {
    const userMsg = msg.toString().toLowerCase().trim();
    console.log("📩 Chatbot received:", userMsg);

    let response = "🤔 I’m not sure, try asking about bidding, payments, reminders, cars, or auction rules.";

    for (let key in faq) {
      if (userMsg.includes(key)) {
        response = faq[key];
        break;
      }
    }

    setTimeout(() => ws.send(response), 400); // typing delay
  });

  ws.on("close", () => console.log("❌ Chatbot client disconnected"));
});