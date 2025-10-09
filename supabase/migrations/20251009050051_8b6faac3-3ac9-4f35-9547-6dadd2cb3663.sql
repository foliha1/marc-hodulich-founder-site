-- Make description column nullable since we're removing it from the UI
ALTER TABLE podcasts ALTER COLUMN description DROP NOT NULL;

-- Add comment to clarify the podcast_url is for YouTube videos
COMMENT ON COLUMN podcasts.podcast_url IS 'YouTube video URL';