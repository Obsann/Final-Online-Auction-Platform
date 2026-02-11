const express = require("express");
const router = express.Router();
const { getAllUsers, getPendingItems, getAllAuctions } = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Admin routes (all protected — authMiddleware sets req.user, adminMiddleware checks role)
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/items/pending", authMiddleware, adminMiddleware, getPendingItems);
router.get("/auctions", authMiddleware, adminMiddleware, getAllAuctions);

module.exports = router;
