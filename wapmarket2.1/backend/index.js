const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const auth = require('./routes/auth');
const products = require('./routes/products');
const banners = require('./routes/banners');
const orders = require('./routes/orders');
const configRoute = require('./routes/config');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploads and frontend static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// API routes
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/banners', banners);
app.use('/api/orders', orders);
app.use('/api/config', configRoute);

// On start - run DB init if needed (db/init.sql should be applied via docker-compose or manually)
// If ADMIN_EMAIL and ADMIN_PASSWORD are set, create admin user if not exists
(async () => {
  try {
    await db.pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT, role TEXT, created_at TIMESTAMP DEFAULT now()
    )`);
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const res = await db.query('SELECT * FROM users WHERE email = $1', [process.env.ADMIN_EMAIL]);
      if (res.rowCount === 0) {
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        await db.query('INSERT INTO users (email,password_hash,role) VALUES ($1,$2,$3)', [process.env.ADMIN_EMAIL, hash, 'admin']);
        console.log('Admin user created:', process.env.ADMIN_EMAIL);
      }
    }
  } catch (err) {
    console.error('Startup DB error', err);
  }
})();

app.listen(PORT, () => {
  console.log(`WapMarket backend running on port ${PORT}`);
});
