const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Supabase connection string
const pool = new Pool({
  connectionString: 'postgresql://postgres.fmiwvnsngzrpglzemucv:5VmeGIabATGCjpvr@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
});

app.use(cors());
app.use(express.json());

// Users API
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING *',
      [username, password, isAdmin]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    const result = await pool.query(
      'UPDATE users SET username = $1, password = $2 WHERE id = $3 RETURNING *',
      [username, password, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Channels API
app.post('/api/channels', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      'INSERT INTO channels (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/channels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM channels');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/channels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(
      'UPDATE channels SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/channels/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM channels WHERE id = $1', [id]);
    res.json({ message: 'Channel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Messages API
app.post('/api/messages', async (req, res) => {
  try {
    const { channelId, userId, content, type } = req.body;
    const result = await pool.query(
      'INSERT INTO messages (channel_id, user_id, content, type, timestamp) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [channelId, userId, content, type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await pool.query('SELECT * FROM messages WHERE channel_id = $1 ORDER BY timestamp ASC', [channelId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
