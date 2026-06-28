const express = require('express');
const { getPool, sql } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all notifications for current user
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT * FROM dbo.Notifications WHERE user_id = @userId ORDER BY created_at DESC');

    res.json(result.recordset);
  } catch (err) {
    next(err);
  }
});

// Mark all notifications as read for current user
router.post('/read', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('UPDATE dbo.Notifications SET unread = 0 WHERE user_id = @userId');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
