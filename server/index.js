import express from 'express';
import pg from 'pg';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init error:', err);
  }
}

// Get all saved models
app.get('/api/models', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, created_at, updated_at FROM saved_models ORDER BY updated_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Get a specific model
app.get('/api/models/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM saved_models WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching model:', err);
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

// Save a new model
app.post('/api/models', async (req, res) => {
  const { name, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO saved_models (name, data) VALUES ($1, $2) RETURNING id, name, created_at, updated_at',
      [name, JSON.stringify(data)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error saving model:', err);
    res.status(500).json({ error: 'Failed to save model' });
  }
});

// Update an existing model
app.put('/api/models/:id', async (req, res) => {
  const { name, data } = req.body;
  try {
    const result = await pool.query(
      'UPDATE saved_models SET name = $1, data = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, created_at, updated_at',
      [name, JSON.stringify(data), req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating model:', err);
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// Delete a model
app.delete('/api/models/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM saved_models WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting model:', err);
    res.status(500).json({ error: 'Failed to delete model' });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
