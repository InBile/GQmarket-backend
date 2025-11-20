const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ admin_phone: process.env.ADMIN_PHONE || '+240555218661', shipping_cost: 2000 });
});

module.exports = router;
