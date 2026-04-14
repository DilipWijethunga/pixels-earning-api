const express = require('express');
const router = express.Router();

// GET /api/pixel-price
router.get('/', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=PIXEL-USDT'
    );
    if (!response.ok) {
      throw new Error(`KuCoin API error: ${response.status}`);
    }
    const json = await response.json();
    const price = json?.data?.price;
    if (!price) {
      return res.status(502).json({ message: 'Price not available from KuCoin' });
    }
    res.json({ price: parseFloat(price) });
  } catch (err) {
    res.status(502).json({ message: err.message });
  }
});

module.exports = router;
