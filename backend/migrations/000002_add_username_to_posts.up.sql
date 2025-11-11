-- Add username column to posts table
ALTER TABLE posts ADD COLUMN username VARCHAR(50) NOT NULL DEFAULT '';

-- Backfill username from users table for existing posts
UPDATE posts
SET username = users.username
FROM users
WHERE posts.user_id = users.id;

-- Create index on username for better query performance
CREATE INDEX idx_posts_username ON posts(username);
