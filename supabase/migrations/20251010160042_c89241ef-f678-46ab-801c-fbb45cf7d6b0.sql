-- Remove profile_image_url column from movement_content table
ALTER TABLE public.movement_content DROP COLUMN IF EXISTS profile_image_url;