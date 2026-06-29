const express = require('express');
const { getPool, sql } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register a vote on a poll option
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { poll_id, option_id } = req.body;

    if (!poll_id || !option_id) {
      return res.status(400).json({ error: 'Poll ID and Option ID are required' });
    }

    const pool = await getPool();

    // 1. Verify that the option exists and belongs to the specified poll
    const optionResult = await pool.request()
      .input('optionId', sql.NVarChar, option_id)
      .input('pollId', sql.NVarChar, poll_id)
      .query('SELECT id FROM dbo.PollOptions WHERE id = @optionId AND poll_id = @pollId');

    if (optionResult.recordset.length === 0) {
      return res.status(400).json({ error: 'Invalid Option ID for the specified Poll' });
    }

    // 2. Fetch the poll details
    const pollResult = await pool.request()
      .input('pollId', sql.NVarChar, poll_id)
      .query('SELECT title, voting_mode, is_active, closes_at, created_by FROM dbo.Polls WHERE id = @pollId');

    if (pollResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const poll = pollResult.recordset[0];

    if (!poll.is_active || (poll.closes_at && new Date(poll.closes_at) < new Date())) {
      return res.status(400).json({ error: 'This poll is no longer active' });
    }

    // 3. For 'single' mode, check if the user has already voted on this poll
    if (poll.voting_mode === 'single') {
      const checkVote = await pool.request()
        .input('pollId', sql.NVarChar, poll_id)
        .input('userId', sql.Int, req.user.id)
        .query('SELECT id FROM dbo.Votes WHERE poll_id = @pollId AND user_id = @userId');

      if (checkVote.recordset.length > 0) {
        return res.status(400).json({ error: 'You have already voted on this poll' });
      }
    } else {
      // For 'multiple' mode, check if the user has already voted on this *specific option*
      const checkVoteOption = await pool.request()
        .input('optionId', sql.NVarChar, option_id)
        .input('userId', sql.Int, req.user.id)
        .query('SELECT id FROM dbo.Votes WHERE option_id = @optionId AND user_id = @userId');

      if (checkVoteOption.recordset.length > 0) {
        return res.status(400).json({ error: 'You have already voted for this option' });
      }
    }

    // 4. Insert the vote
    const insertVote = await pool.request()
      .input('pollId', sql.NVarChar, poll_id)
      .input('optionId', sql.NVarChar, option_id)
      .input('userId', sql.Int, req.user.id)
      .query(`
        INSERT INTO dbo.Votes (poll_id, option_id, user_id)
        OUTPUT inserted.id, inserted.poll_id, inserted.option_id, inserted.user_id, inserted.created_at
        VALUES (@pollId, @optionId, @userId)
      `);

    // 5. Notify the poll creator if someone else votes
    if (poll.created_by && poll.created_by !== req.user.id) {
      const voter = req.user.username ? `@${req.user.username}` : 'Someone';
      await pool.request()
        .input('creatorId', sql.Int, poll.created_by)
        .input('title', sql.NVarChar, 'New vote on your poll')
        .input('body', sql.NVarChar, `${voter} voted on your poll "${poll.title}".`)
        .input('route', sql.NVarChar, `/poll/${poll_id}`)
        .query(`
          INSERT INTO dbo.Notifications (user_id, title, body, icon, route)
          VALUES (@creatorId, @title, @body, '📊', @route)
        `);
    }

    res.status(201).json(insertVote.recordset[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
