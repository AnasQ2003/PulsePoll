const express = require('express');
const { getPool, sql } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to fetch all options and votes and attach them to polls
const populatePolls = async (polls, pool) => {
  if (polls.length === 0) return [];

  const pollIds = polls.map(p => p.id);
  
  // Fetch options
  // Since we want to load all options for these polls, we filter in JS or via IN clause
  const optionsResult = await pool.request().query('SELECT * FROM dbo.PollOptions ORDER BY position ASC');
  const votesResult = await pool.request().query('SELECT * FROM dbo.Votes');

  const allOptions = optionsResult.recordset;
  const allVotes = votesResult.recordset;

  return polls.map(p => {
    const poll_options = allOptions.filter(o => o.poll_id === p.id);
    const votes = allVotes.filter(v => v.poll_id === p.id);
    return {
      ...p,
      poll_options,
      votes,
      option_count: poll_options.length,
      vote_count: votes.length
    };
  });
};

// Get all polls (optionally filtered by category or search)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT p.*, u.username as creator_username
      FROM dbo.Polls p
      LEFT JOIN dbo.Users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `);

    const polls = await populatePolls(result.recordset, pool);
    res.json(polls);
  } catch (err) {
    next(err);
  }
});

// Get current user's polls
router.get('/mine', authenticateToken, async (req, res, next) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT p.*, u.username as creator_username
        FROM dbo.Polls p
        LEFT JOIN dbo.Users u ON p.created_by = u.id
        WHERE p.created_by = @userId
        ORDER BY p.created_at DESC
      `);

    const polls = await populatePolls(result.recordset, pool);
    res.json(polls);
  } catch (err) {
    next(err);
  }
});

// Get a single poll detail by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = await getPool();

    // Fetch poll
    const pollResult = await pool.request()
      .input('id', sql.NVarChar, id)
      .query('SELECT * FROM dbo.Polls WHERE id = @id');

    if (pollResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const poll = pollResult.recordset[0];

    // Fetch options
    const optionsResult = await pool.request()
      .input('pollId', sql.NVarChar, id)
      .query('SELECT * FROM dbo.PollOptions WHERE poll_id = @pollId ORDER BY position ASC');

    // Fetch votes
    const votesResult = await pool.request()
      .input('pollId', sql.NVarChar, id)
      .query('SELECT option_id, user_id, created_at FROM dbo.Votes WHERE poll_id = @pollId');

    res.json({
      poll,
      options: optionsResult.recordset,
      votes: votesResult.recordset
    });
  } catch (err) {
    next(err);
  }
});

// Create a new poll
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { title, description, category, cover_emoji, voting_mode, options } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Title and at least 2 options are required' });
    }

    const pool = await getPool();

    // Insert poll
    const pollResult = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('coverEmoji', sql.NVarChar, cover_emoji || '📊')
      .input('category', sql.NVarChar, category || 'General')
      .input('votingMode', sql.NVarChar, voting_mode || 'single')
      .input('createdBy', sql.Int, req.user.id)
      .query(`
        INSERT INTO dbo.Polls (title, description, cover_emoji, category, voting_mode, created_by)
        OUTPUT inserted.id, inserted.title, inserted.description, inserted.cover_emoji, inserted.category, inserted.voting_mode, inserted.created_by, inserted.created_at
        VALUES (@title, @description, @coverEmoji, @category, @votingMode, @createdBy)
      `);

    const poll = pollResult.recordset[0];

    // Insert options
    for (let i = 0; i < options.length; i++) {
      await pool.request()
        .input('pollId', sql.NVarChar, poll.id)
        .input('label', sql.NVarChar, options[i])
        .input('position', sql.Int, i)
        .query('INSERT INTO dbo.PollOptions (poll_id, label, position) VALUES (@pollId, @label, @position)');
    }

    res.status(201).json(poll);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
