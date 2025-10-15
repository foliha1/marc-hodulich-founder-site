-- Add image dimension columns for performance optimization
-- These dimensions will be used to prevent layout shift (CLS) during image loading

-- Add width and height to carousel_slides
ALTER TABLE public.carousel_slides 
ADD COLUMN IF NOT EXISTS width integer,
ADD COLUMN IF NOT EXISTS height integer;

-- Add width and height to meet_marc_cards
ALTER TABLE public.meet_marc_cards 
ADD COLUMN IF NOT EXISTS width integer,
ADD COLUMN IF NOT EXISTS height integer;

-- Add width and height to hero_content
ALTER TABLE public.hero_content 
ADD COLUMN IF NOT EXISTS background_image_width integer,
ADD COLUMN IF NOT EXISTS background_image_height integer;