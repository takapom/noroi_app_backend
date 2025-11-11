-- Remove username column from posts table
DROP INDEX IF EXISTS idx_posts_username;
ALTER TABLE posts DROP COLUMN username;
