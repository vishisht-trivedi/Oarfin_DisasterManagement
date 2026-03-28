const express = require('express');
const router = express.Router();
const { getBBCNews, getNDTVNews, getRedditNews, getCacheStats } = require('../controllers/scraperController');

// GET /api/news/bbc
router.get('/bbc', getBBCNews);

// GET /api/news/ndtv
router.get('/ndtv', getNDTVNews);

// GET /api/news/reddit
router.get('/reddit', getRedditNews);

// GET /api/news/cache-stats
router.get('/cache-stats', getCacheStats);

module.exports = router;
