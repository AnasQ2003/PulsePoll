const express = require('express');
const { getPool, sql } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get current user's profile
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, username, display_name, bio, avatar_url, phone FROM dbo.Users WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
});

// Update current user's profile
router.patch('/me', authenticateToken, async (req, res, next) => {
  try {
    const { display_name, username, bio, phone, avatar_url } = req.body;
    const pool = await getPool();

    // If username is changing, ensure it's not taken
    if (username && username !== req.user.username) {
      const checkUser = await pool.request()
        .input('username', sql.NVarChar, username)
        .input('myId', sql.Int, req.user.id)
        .query('SELECT id FROM dbo.Users WHERE username = @username AND id <> @myId');
      if (checkUser.recordset.length > 0) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    // Build update fields dynamic query
    let query = 'UPDATE dbo.Users SET ';
    const request = pool.request();
    request.input('id', sql.Int, req.user.id);

    const fields = [];
    if (display_name !== undefined) {
      request.input('display_name', sql.NVarChar, display_name);
      fields.push('display_name = @display_name');
    }
    if (username !== undefined) {
      request.input('username', sql.NVarChar, username);
      fields.push('username = @username');
    }
    if (bio !== undefined) {
      request.input('bio', sql.NVarChar, bio);
      fields.push('bio = @bio');
    }
    if (phone !== undefined) {
      request.input('phone', sql.NVarChar, phone);
      fields.push('phone = @phone');
    }
    if (avatar_url !== undefined) {
      request.input('avatar_url', sql.NVarChar, avatar_url);
      fields.push('avatar_url = @avatar_url');
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    query += fields.join(', ') + ' WHERE id = @id';
    await request.query(query);

    // Fetch and return the updated profile
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, username, display_name, bio, avatar_url, phone FROM dbo.Users WHERE id = @id');

    res.json(result.recordset[0]);
  } catch (err) {
    next(err);
  }
});

// Get user profile stats (voted count, created polls count)
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    
    const votedResult = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT COUNT(*) AS count FROM dbo.Votes WHERE user_id = @userId');

    const createdResult = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT COUNT(*) AS count FROM dbo.Polls WHERE created_by = @userId');

    res.json({
      voted: votedResult.recordset[0].count,
      created: createdResult.recordset[0].count,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
