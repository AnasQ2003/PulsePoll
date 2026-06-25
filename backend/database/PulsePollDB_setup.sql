-- ============================================================
--  PulsePoll — SQL Server Database Setup Script
--  Run this in SSMS or sqlcmd against your SQL Server instance
-- ============================================================

USE master;
GO

-- ── Create database if it doesn't exist ──────────────────────
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'PulsePollDB')
BEGIN
    CREATE DATABASE PulsePollDB;
    PRINT '✅ PulsePollDB created.';
END
GO

USE PulsePollDB;
GO

-- ============================================================
--  TABLE: Users
-- ============================================================
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        id            INT IDENTITY(1,1) PRIMARY KEY,
        display_name  NVARCHAR(100)   NOT NULL,
        username      NVARCHAR(50)    NOT NULL UNIQUE,
        email         NVARCHAR(255)   NOT NULL UNIQUE,
        password_hash NVARCHAR(255)   NOT NULL,   -- bcrypt hash
        bio           NVARCHAR(500)   NULL,
        avatar_url    NVARCHAR(500)   NULL,
        phone         NVARCHAR(30)    NULL,
        created_at    DATETIME2       NOT NULL DEFAULT GETDATE(),
        updated_at    DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table Users created.';
END
GO

-- ============================================================
--  TABLE: UserRoles
-- ============================================================
IF OBJECT_ID('dbo.UserRoles', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.UserRoles (
        id         NVARCHAR(50)    PRIMARY KEY DEFAULT NEWID(),
        user_id    INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        role       NVARCHAR(20)    NOT NULL DEFAULT 'user'   -- 'admin' | 'user'
            CHECK (role IN ('admin', 'user')),
        created_at DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table UserRoles created.';
END
GO

-- ============================================================
--  TABLE: Polls
-- ============================================================
IF OBJECT_ID('dbo.Polls', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Polls (
        id              NVARCHAR(50)    PRIMARY KEY DEFAULT NEWID(),
        title           NVARCHAR(300)   NOT NULL,
        description     NVARCHAR(1000)  NULL,
        cover_emoji     NVARCHAR(10)    NULL DEFAULT '📊',
        category        NVARCHAR(100)   NULL,
        voting_mode     NVARCHAR(50)    NOT NULL DEFAULT 'single'   -- 'single' | 'multiple'
            CHECK (voting_mode IN ('single', 'multiple')),
        is_active       BIT             NOT NULL DEFAULT 1,
        closes_at       DATETIME2       NULL,
        created_by      INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        created_at      DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table Polls created.';
END
GO

-- ============================================================
--  TABLE: PollOptions
-- ============================================================
IF OBJECT_ID('dbo.PollOptions', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PollOptions (
        id         NVARCHAR(50)    PRIMARY KEY DEFAULT NEWID(),
        poll_id    NVARCHAR(50)    NOT NULL REFERENCES dbo.Polls(id) ON DELETE CASCADE,
        label      NVARCHAR(300)   NOT NULL,
        position   INT             NOT NULL DEFAULT 0,
        created_at DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table PollOptions created.';
END
GO

-- ============================================================
--  TABLE: Votes
-- ============================================================
IF OBJECT_ID('dbo.Votes', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Votes (
        id         NVARCHAR(50)    PRIMARY KEY DEFAULT NEWID(),
        poll_id    NVARCHAR(50)    NOT NULL REFERENCES dbo.Polls(id) ON DELETE CASCADE,
        option_id  NVARCHAR(50)    NOT NULL REFERENCES dbo.PollOptions(id),
        user_id    INT             NOT NULL REFERENCES dbo.Users(id),
        created_at DATETIME2       NOT NULL DEFAULT GETDATE(),
        -- Prevent duplicate votes per option per user (single-mode guard)
        CONSTRAINT UQ_Votes_User_Option UNIQUE (user_id, option_id)
    );
    PRINT '✅ Table Votes created.';
END
GO

-- ============================================================
--  TABLE: Notifications
-- ============================================================
IF OBJECT_ID('dbo.Notifications', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notifications (
        id         NVARCHAR(50)    PRIMARY KEY DEFAULT NEWID(),
        user_id    INT             NOT NULL REFERENCES dbo.Users(id) ON DELETE CASCADE,
        title      NVARCHAR(200)   NOT NULL,
        body       NVARCHAR(500)   NOT NULL,
        icon       NVARCHAR(10)    NOT NULL DEFAULT '🔔',
        unread     BIT             NOT NULL DEFAULT 1,
        route      NVARCHAR(200)   NULL,
        created_at DATETIME2       NOT NULL DEFAULT GETDATE()
    );
    PRINT '✅ Table Notifications created.';
END
GO

-- ============================================================
--  SEED: First user — Anas (admin)
--  email: anas@example.com  |  password: anas123
--  Bcrypt hash of 'anas123' (10 rounds):
--    $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi
-- ============================================================
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE email = 'anas@example.com')
BEGIN
    INSERT INTO dbo.Users
        (display_name, username, email, password_hash, bio, avatar_url)
    VALUES
        (
            'Anas',
            'anas',
            'anas@example.com',
            '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHHi',
            'Poll creator & power voter.',
            NULL
        );
    PRINT '✅ Seed user Anas inserted (email: anas@example.com, password: anas123).';
END
GO

-- Assign admin role to Anas
DECLARE @anasId INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.UserRoles WHERE user_id = @anasId)
BEGIN
    INSERT INTO dbo.UserRoles (user_id, role) VALUES (@anasId, 'admin');
    PRINT '✅ Admin role assigned to Anas.';
END
GO

-- ============================================================
--  SEED: Sample Polls
-- ============================================================
DECLARE @anasId2 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');

-- Poll 1: Best Programming Language
IF @anasId2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Polls WHERE title = 'Best Programming Language 2026')
BEGIN
    DECLARE @poll1 NVARCHAR(50) = NEWID();
    INSERT INTO dbo.Polls (id, title, description, cover_emoji, category, voting_mode, is_active, created_by)
    VALUES (@poll1, 'Best Programming Language 2026', 'What''s your go-to language this year?', '💻', 'Technology', 'single', 1, @anasId2);

    INSERT INTO dbo.PollOptions (poll_id, label, position) VALUES
    (@poll1, 'TypeScript', 0),
    (@poll1, 'Python', 1),
    (@poll1, 'Rust', 2),
    (@poll1, 'Go', 3);

    PRINT '✅ Seed poll 1 inserted.';
END
GO

-- Poll 2: Remote Work Preference
DECLARE @anasId3 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Polls WHERE title = 'Remote vs Office in 2026')
BEGIN
    DECLARE @poll2 NVARCHAR(50) = NEWID();
    INSERT INTO dbo.Polls (id, title, description, cover_emoji, category, voting_mode, is_active, created_by)
    VALUES (@poll2, 'Remote vs Office in 2026', 'Where do you work best?', '🏠', 'Work & Lifestyle', 'single', 1, @anasId3);

    INSERT INTO dbo.PollOptions (poll_id, label, position) VALUES
    (@poll2, 'Fully Remote', 0),
    (@poll2, 'Hybrid (3 days office)', 1),
    (@poll2, 'Full Office', 2);

    PRINT '✅ Seed poll 2 inserted.';
END
GO

-- Poll 3: Favourite Drink
DECLARE @anasId4 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Polls WHERE title = 'What''s your go-to morning drink?')
BEGIN
    DECLARE @poll3 NVARCHAR(50) = NEWID();
    INSERT INTO dbo.Polls (id, title, description, cover_emoji, category, voting_mode, is_active, created_by)
    VALUES (@poll3, 'What''s your go-to morning drink?', 'The age-old debate.', '☕', 'Food & Drinks', 'single', 1, @anasId4);

    INSERT INTO dbo.PollOptions (poll_id, label, position) VALUES
    (@poll3, 'Coffee ☕', 0),
    (@poll3, 'Tea 🍵', 1),
    (@poll3, 'Water 💧', 2),
    (@poll3, 'Energy Drink ⚡', 3);

    PRINT '✅ Seed poll 3 inserted.';
END
GO

-- ============================================================
--  SEED: Notifications for Anas
-- ============================================================
DECLARE @anasId5 INT = (SELECT id FROM dbo.Users WHERE email = 'anas@example.com');
IF @anasId5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM dbo.Notifications WHERE user_id = @anasId5)
BEGIN
    INSERT INTO dbo.Notifications (user_id, title, body, icon, unread, route) VALUES
    (@anasId5, 'Welcome to PulsePoll! 🎉', 'Start by creating your first poll or discovering trending ones.', '🎉', 1, '/home'),
    (@anasId5, 'New vote on your poll', 'Someone voted on "Best Programming Language 2026".', '📊', 1, '/results'),
    (@anasId5, 'Trending now', 'Remote vs Office poll is gaining traction.', '🔥', 0, '/discover');
    PRINT '✅ Seed notifications for Anas inserted.';
END
GO

-- ============================================================
--  VERIFY
-- ============================================================
SELECT 'Users'         AS [Table], COUNT(*) AS [Rows] FROM dbo.Users         UNION ALL
SELECT 'UserRoles',                 COUNT(*)            FROM dbo.UserRoles     UNION ALL
SELECT 'Polls',                     COUNT(*)            FROM dbo.Polls         UNION ALL
SELECT 'PollOptions',               COUNT(*)            FROM dbo.PollOptions   UNION ALL
SELECT 'Votes',                     COUNT(*)            FROM dbo.Votes         UNION ALL
SELECT 'Notifications',             COUNT(*)            FROM dbo.Notifications;
GO

PRINT '🎉 PulsePollDB setup complete!';
GO
