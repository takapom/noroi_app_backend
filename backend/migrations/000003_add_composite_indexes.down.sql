-- Drop composite indexes for rollback
DROP INDEX IF EXISTS idx_posts_type_deleted_created;
DROP INDEX IF EXISTS idx_posts_user_deleted_created;
DROP INDEX IF EXISTS idx_users_email_deleted;
