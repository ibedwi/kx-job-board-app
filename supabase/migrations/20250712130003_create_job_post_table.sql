-- Create job_post table
-- Job postings created by employers for their companies

CREATE TABLE IF NOT EXISTS job_post (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES company(id),
  created_by_id UUID NOT NULL REFERENCES "user"(id),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at trigger
CREATE TRIGGER update_job_post_updated_at
    BEFORE UPDATE ON job_post
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE job_post ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_job_post_company_id ON job_post(company_id);
CREATE INDEX IF NOT EXISTS idx_job_post_created_by_id ON job_post(created_by_id);
CREATE INDEX IF NOT EXISTS idx_job_post_closed_at ON job_post(closed_at);
CREATE INDEX IF NOT EXISTS idx_job_post_deleted_at ON job_post(deleted_at);
CREATE INDEX IF NOT EXISTS idx_job_post_created_at ON job_post(created_at DESC);

-- Index for active jobs (not closed and not deleted)
CREATE INDEX IF NOT EXISTS idx_job_post_active 
ON job_post(company_id, created_at DESC) 
WHERE closed_at IS NULL AND deleted_at IS NULL;