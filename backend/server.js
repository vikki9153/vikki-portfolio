const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, databaseReady } = require('./database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const staticPath = path.join(__dirname, '../myportfolio');
app.use(express.static(staticPath));

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.get('/api/contacts', async (req, res) => {
  try {
    await databaseReady;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM contacts ORDER BY created_at DESC');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Unable to fetch contacts.' });
  }
});

// Serve frontend for all other requests
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    await databaseReady;
    const connection = await pool.getConnection();
    const query = 'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
    await connection.query(query, [name, email, phone, subject, message]);
    connection.release();
    res.status(201).json({ success: true, message: 'Message saved to database.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Database save failed.' });
  }
});

const PORT = process.env.PORT || 5000;
databaseReady.then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Backend running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to initialize database, server not started.', error);
});
