-- Run in the Supabase SQL Editor if the global voting index is missing.
-- Existing duplicate records cause this statement to fail without deleting votes.
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_project_votes_email
ON public.project_votes (lower(voter_email));
