-- Add Instagram support to social_posts table
ALTER TABLE public.social_posts 
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS post_type text NOT NULL DEFAULT 'uploaded_image';

-- Add check constraint for post_type
ALTER TABLE public.social_posts
ADD CONSTRAINT social_posts_post_type_check 
CHECK (post_type IN ('uploaded_image', 'instagram_embed'));