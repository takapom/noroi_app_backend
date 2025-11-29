-- Companies (マスタ)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    recruitment_url TEXT,
    industry TEXT,
    location TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Applications（ユーザーごとの応募）
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    company_id UUID NOT NULL REFERENCES companies(id),
    category VARCHAR(20) NOT NULL CHECK (category IN ('main', 'intern', 'info')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'scheduled', 'in_progress', 'done', 'withdrawn')),
    scheduled_at TIMESTAMP,
    color_tag VARCHAR(20) NOT NULL CHECK (color_tag IN ('orange', 'purple')),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    motivation TEXT,
    what_to_do TEXT,
    job_axis TEXT,
    strengths TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, company_id, category)
);

-- Selection stages（応募ごとの選考ステップ）
CREATE TABLE selection_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    scheduled_at TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'passed', 'failed')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Reminders（任意機能）
CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    target_at TIMESTAMP NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('in_app', 'email')),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_companies_name ON companies(name);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_company ON applications(company_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_category ON applications(category);
CREATE INDEX idx_applications_scheduled_at ON applications(scheduled_at);

CREATE INDEX idx_selection_stages_app ON selection_stages(application_id);
CREATE INDEX idx_selection_stages_status ON selection_stages(status);
CREATE INDEX idx_selection_stages_scheduled_at ON selection_stages(scheduled_at);

CREATE INDEX idx_reminders_app ON reminders(application_id);
CREATE INDEX idx_reminders_target_at ON reminders(target_at);

-- updated_at triggers
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_selection_stages_updated_at
    BEFORE UPDATE ON selection_stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
    BEFORE UPDATE ON reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
