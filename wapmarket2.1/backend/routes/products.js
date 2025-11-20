const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const upload = multer({ dest: path.join(__dirname,'..','uploads') });

// Get all products (with category name)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Get single
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

// Create product (admin) - supports image upload
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, brand, category_id } = req.body;
    let image_url = req.body.image_url || null;
    if (req.file) {
      image_url = '/uploads/' + req.file.filename;
    }
    const result = await db.query(
      `INSERT INTO products (name, price, description, brand, image_url, category_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, price, description, brand, image_url, category_id || null]
    );
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

// Update product (admin)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, brand, category_id } = req.body;
    let image_url = req.body.image_url || null;
    if (req.file) image_url = '/uploads/' + req.file.filename;
    const result = await db.query(`UPDATE products SET name=$1, price=$2, description=$3, brand=$4, image_url=$5, category_id=$6 WHERE id=$7 RETURNING *`,
      [name, price, description, brand, image_url, category_id || null, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

module.exports = router;
