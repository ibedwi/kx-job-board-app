-- Create company table
-- Companies are owned by users and can have multiple employers

CREATE TABLE IF NOT EXISTS company (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID NOT NULL REFERENCES "user"(id),
  company_owner UUID NOT NULL REFERENCES "user"(id),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger
CREATE TRIGGER update_company_updated_at
    BEFORE UPDATE ON company
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_company_owner ON company(company_owner);

-- TODO: Might need to do this later.
-- Add unique constraint on display_name
-- ALTER TABLE company ADD CONSTRAINT unique_company_display_name UNIQUE (display_name);
-- CREATE INDEX IF NOT EXISTS idx_company_display_name ON company(display_name);
