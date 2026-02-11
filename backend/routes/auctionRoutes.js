const express = require('express');
const {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  getMyBids,
  deleteAuction,
} = require('../controllers/auctionController');
const { authMiddleware } = require('../middleware/authMiddleware'); // fixed JWT auth

const router = express.Router();

// @route   POST /api/auctions
// @desc    Create a new auction
// @access  Protected
router.post('/', authMiddleware, createAuction);

// @route   GET /api/auctions
// @desc    Get all auctions
// @access  Public
router.get('/', getAllAuctions);

// @route   GET /api/auctions/my-bids
// @desc    Get auctions the current user has bid on
// @access  Protected
// NOTE: Must be before /:id to avoid Express treating "my-bids" as an ID
router.get('/my-bids', authMiddleware, getMyBids);

// @route   GET /api/auctions/:id
// @desc    Get auction by ID
// @access  Public
router.get('/:id', getAuctionById);

// @route   PATCH /api/auctions/:id
// @desc    Update auction
// @access  Protected
router.patch('/:id', authMiddleware, updateAuction);

// @route   DELETE /api/auctions/:id
// @desc    Delete auction
// @access  Protected
router.delete('/:id', authMiddleware, deleteAuction);

module.exports = router;
