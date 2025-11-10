-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Curse Styles Table
CREATE TABLE curse_styles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    point_cost INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'unknown')),
    curse_style_id UUID NOT NULL REFERENCES curse_styles(id),
    points INT NOT NULL DEFAULT 0,
    profile_public BOOLEAN DEFAULT TRUE,
    notify_curse BOOLEAN DEFAULT TRUE,
    notify_ritual BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

-- Posts Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    post_type VARCHAR(20) NOT NULL CHECK (post_type IN ('normal', 'ritual')),
    is_anonymous BOOLEAN DEFAULT FALSE,
    ritual_id UUID,
    curse_count INT NOT NULL DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_ritual_id ON posts(ritual_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_deleted ON posts(is_deleted);

-- Curses Table (Likes)
CREATE TABLE curses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    post_id UUID NOT NULL REFERENCES posts(id),
    ritual_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_curses_user_id ON curses(user_id);
CREATE INDEX idx_curses_post_id ON curses(post_id);
CREATE INDEX idx_curses_ritual_id ON curses(ritual_id);

-- Rituals Table
CREATE TABLE rituals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    max_hp INT NOT NULL DEFAULT 300000,
    current_hp INT NOT NULL DEFAULT 300000,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'success', 'failed')),
    participant_count INT NOT NULL DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_rituals_start_time ON rituals(start_time);
CREATE INDEX idx_rituals_status ON rituals(status);

-- Ritual Participants Table
CREATE TABLE ritual_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ritual_id UUID NOT NULL REFERENCES rituals(id),
    user_id UUID NOT NULL REFERENCES users(id),
    total_damage INT NOT NULL DEFAULT 0,
    post_count INT NOT NULL DEFAULT 0,
    curse_count INT NOT NULL DEFAULT 0,
    rank INT NOT NULL DEFAULT 0,
    points_earned INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ritual_id, user_id)
);

CREATE INDEX idx_ritual_participants_ritual_id ON ritual_participants(ritual_id);
CREATE INDEX idx_ritual_participants_user_id ON ritual_participants(user_id);
CREATE INDEX idx_ritual_participants_total_damage ON ritual_participants(total_damage DESC);

-- Rankings Table
CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'all_time')),
    rank INT NOT NULL,
    curse_count INT NOT NULL,
    post_count INT NOT NULL,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rankings_user_id ON rankings(user_id);
CREATE INDEX idx_rankings_period ON rankings(period);
CREATE INDEX idx_rankings_period_start ON rankings(period_start);
CREATE INDEX idx_rankings_rank ON rankings(rank);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rituals_updated_at BEFORE UPDATE ON rituals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ritual_participants_updated_at BEFORE UPDATE ON ritual_participants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default curse styles
INSERT INTO curse_styles (name, name_en, description, is_special, point_cost) VALUES
('炎獄の儀式', 'Infernal Rite', '業火で全てを焼き尽くす激情の呪術', FALSE, 0),
('氷結の呪縛', 'Frozen Curse', '凍てつく憎悪で対象を封じ込める', FALSE, 0),
('闇夜の囁き', 'Shadow Whisper', '闇に潜む怨念が静かに蝕む', FALSE, 0),
('血盟の刻印', 'Blood Covenant', '血の契約により永遠に縛る', FALSE, 0),
('骸骨の舞踏', 'Danse Macabre', '死者の舞により魂を導く', FALSE, 0);
