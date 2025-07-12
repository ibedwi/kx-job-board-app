-- Add additional columns to job_post table for better job posting details

-- Add title column (required)
ALTER TABLE job_post ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Untitled Position';

-- Add location column (optional)
ALTER TABLE job_post ADD COLUMN IF NOT EXISTS location TEXT;

-- Create job type enum for better data consistency
DO $$ BEGIN
    CREATE TYPE job_type_enum AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add job_type column with enum constraint
ALTER TABLE job_post ADD COLUMN IF NOT EXISTS job_type job_type_enum DEFAULT 'FULL_TIME';


-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_post_title ON job_post(title);
CREATE INDEX IF NOT EXISTS idx_job_post_location ON job_post(location);
CREATE INDEX IF NOT EXISTS idx_job_post_job_type ON job_post(job_type);

-- Create composite index for common filtering (location + job_type + active status)
CREATE INDEX IF NOT EXISTS idx_job_post_search 
ON job_post(location, job_type, created_at DESC) 
WHERE closed_at IS NULL AND deleted_at IS NULL;
