-- Drop triggers first
DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
DROP TRIGGER IF EXISTS update_selection_stages_updated_at ON selection_stages;
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS selection_stages;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS companies;
