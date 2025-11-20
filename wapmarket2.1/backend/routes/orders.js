const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

const SHIPPING_COST = 2000; // XAF

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

router.post('/', async (req, res) => {
  try {
    const { customer_name, phone, address, items, shipping } = req.body;
    const subtotal = items.reduce((s, it) => s + (Number(it.price) * Number(it.quantity)), 0);
    const shipping_cost = shipping ? SHIPPING_COST : 0;
    const total = subtotal + shipping_cost;
    const result = await db.query(
      `INSERT INTO orders (customer_name, phone, address, items, shipping, subtotal, shipping_cost, total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [customer_name, phone, address, JSON.stringify(items), shipping, subtotal, shipping_cost, total]
    );
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

module.exports = router;
