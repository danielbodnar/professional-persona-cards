-- Add readme_excerpt column to projects table for displaying README
-- content in project modals without needing an R2 fetch on click.
ALTER TABLE projects ADD COLUMN readme_excerpt TEXT;
