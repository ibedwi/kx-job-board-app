-- Create employer_profile table
-- Links users to companies they can post jobs for

CREATE TABLE IF NOT EXISTS employer_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id),
  company_id UUID NOT NULL REFERENCES company(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Ensure user can only have one active employer profile per company
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_employer_per_company 
ON employer_profile(user_id, company_id) 
WHERE deleted_at IS NULL;

-- Create updated_at trigger
CREATE TRIGGER update_employer_profile_updated_at
    BEFORE UPDATE ON employer_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE employer_profile ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employer_profile_user_id ON employer_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profile_company_id ON employer_profile(company_id);