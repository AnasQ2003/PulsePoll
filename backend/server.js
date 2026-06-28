require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Root & health check ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    app: 'PulsePoll API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      polls: '/api/polls',
      votes: '/api/votes',
      profiles: '/api/profiles',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'PulsePoll API', timestamp: new Date() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/polls',         require('./routes/polls'));
app.use('/api/votes',         require('./routes/votes'));
app.use('/api/profiles',      require('./routes/profiles'));
app.use('/api/notifications', require('./routes/notifications'));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🟢 PulsePoll API running on http://localhost:${PORT}`);
});
