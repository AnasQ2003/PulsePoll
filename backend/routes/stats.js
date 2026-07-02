const express = require('express');
const { getPool, sql } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get leaderboard — top voters by vote count
router.get('/leaderboard', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TOP 10
        u.id,
        u.display_name,
        u.username,
        COUNT(v.id) AS vote_count
      FROM dbo.Users u
      LEFT JOIN dbo.Votes v ON v.user_id = u.id
      GROUP BY u.id, u.display_name, u.username
      ORDER BY vote_count DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

// Get recent activity — recent votes with who did what on which poll
router.get('/activity', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT TOP 20
        v.created_at,
        u.display_name AS who,
        u.username,
        p.title AS poll_title,
        p.id AS poll_id,
        'voted on' AS action
      FROM dbo.Votes v
      JOIN dbo.Users u ON u.id = v.user_id
      JOIN dbo.Polls p ON p.id = v.poll_id
      ORDER BY v.created_at DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
