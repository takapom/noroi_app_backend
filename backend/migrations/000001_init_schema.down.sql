-- Drop triggers
DROP TRIGGER IF EXISTS update_rankings_updated_at ON rankings;
DROP TRIGGER IF EXISTS update_ritual_participants_updated_at ON ritual_participants;
DROP TRIGGER IF EXISTS update_rituals_updated_at ON rituals;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables
DROP TABLE IF EXISTS rankings;
DROP TABLE IF EXISTS ritual_participants;
DROP TABLE IF EXISTS rituals;
DROP TABLE IF EXISTS curses;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS curse_styles;

-- Drop extension
DROP EXTENSION IF EXISTS "uuid-ossp";
