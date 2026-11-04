ALTER TABLE public.section_content ADD COLUMN IF NOT EXISTS image_url text;

UPDATE public.section_content
SET image_url = 'https://ontkueksqeqypaxvysvu.supabase.co/storage/v1/object/public/cms-images/meet-marc/marc-portrait-vermont.jpg'
WHERE section_name = 'meet_marc';