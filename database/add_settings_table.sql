-- ============================================
-- Add Settings Table for Dynamic Configuration
-- ============================================

-- Create settings table
CREATE TABLE IF NOT EXISTS app_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_settings_key ON app_settings(setting_key);
CREATE INDEX idx_settings_public ON app_settings(is_public);

-- Insert default reCAPTCHA settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('recaptcha_enabled', 'false', 'boolean', 'Enable/disable reCAPTCHA protection', true),
('recaptcha_site_key', '', 'string', 'reCAPTCHA v3 Site Key (public)', true),
('recaptcha_secret_key', '', 'string', 'reCAPTCHA v3 Secret Key (private)', false),
('recaptcha_score_threshold', '0.5', 'number', 'Minimum score to accept (0.0-1.0)', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Function to get public settings (for API)
CREATE OR REPLACE FUNCTION get_public_settings()
RETURNS TABLE (
    setting_key VARCHAR,
    setting_value TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        app_settings.setting_key,
        app_settings.setting_value
    FROM app_settings
    WHERE is_public = true;
END;
$$ LANGUAGE plpgsql;

-- Verification
SELECT * FROM app_settings ORDER BY setting_key;
