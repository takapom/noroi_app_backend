-- Composite index for timeline query (post_type, is_deleted, created_at)
-- Used by FindTimeline query in post_repository_impl.go:87-157
CREATE INDEX idx_posts_type_deleted_created
ON posts(post_type, is_deleted, created_at DESC);

-- Composite index for user posts query (user_id, is_deleted, created_at)
-- Used by FindByUserID query in post_repository_impl.go:159-216
CREATE INDEX idx_posts_user_deleted_created
ON posts(user_id, is_deleted, created_at DESC);

-- Composite index for user email lookup (email, is_deleted)
-- Used by FindByEmail and ExistsByEmail queries in user_repository_impl.go
CREATE INDEX idx_users_email_deleted
ON users(email, is_deleted);
