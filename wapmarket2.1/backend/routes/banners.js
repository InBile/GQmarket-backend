const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const upload = multer({ dest: path.join(__dirname,'..','uploads') });

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM banners ORDER BY id');
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    let image_url = req.body.image_url || null;
    if (req.file) image_url = '/uploads/' + req.file.filename;
    const result = await db.query('INSERT INTO banners (title, description, image_url, link) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, description, image_url, link]);
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    let image_url = req.body.image_url || null;
    if (req.file) image_url = '/uploads/' + req.file.filename;
    const result = await db.query('UPDATE banners SET title=$1, description=$2, image_url=$3, link=$4 WHERE id=$5 RETURNING *',
      [title, description, image_url, link, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM banners WHERE id=$1', [req.params.id]);
    res.json({ ok:true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'DB error' }); }
});

module.exports = router;
