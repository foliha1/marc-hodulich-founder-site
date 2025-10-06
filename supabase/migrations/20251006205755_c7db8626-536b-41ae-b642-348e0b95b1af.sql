-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table for role-based access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Hero content table
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  background_image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hero content"
  ON public.hero_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can update hero content"
  ON public.hero_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default hero content
INSERT INTO public.hero_content (title, description, subtitle, background_image_url)
VALUES (
  'Cartographer of Limits',
  'Marc Hodulich maps human potential through endurance, entrepreneurship, and family. Co-founder of 29029 where summits are metaphors and struggle builds character. A life spent redefining what is possible when you refuse to accept default answers.',
  'Co-founder of 29029 • Builder • Speaker',
  '/src/assets/marc-hero-portrait.jpg'
);

-- Meet Marc cards table
CREATE TABLE public.meet_marc_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.meet_marc_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view meet marc cards"
  ON public.meet_marc_cards FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage meet marc cards"
  ON public.meet_marc_cards FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default meet marc cards
INSERT INTO public.meet_marc_cards (title, description, image_url, display_order) VALUES
('Father. Husband. Present.', 'Being a great father is not about perfection it is about presence. Marc brings intentionality to every moment with his family, showing up fully whether coaching from the sidelines or adventuring in the mountains. It is in these moments that life greatest lessons are learned and shared.', '/src/assets/new-family-image.jpg', 1),
('The Best Lessons Come From Struggle', 'Growth does not happen in comfort zones. Marc journey from business failures to ultra-endurance challenges has taught him that our lowest moments often contain our most valuable lessons. These experiences are not setbacks; they are the raw material for transformation.', '/src/assets/new-failures-firsts-image.jpg', 2),
('Building Beyond Limits', 'As an entrepreneur and co-founder of 29029, Marc has spent decades creating experiences that push boundaries. From real estate ventures to revolutionizing endurance events, he approaches building with the same philosophy: start before you are ready, iterate relentlessly, and never accept that something cannot be done.', '/src/assets/new-builder-image.jpg', 3),
('Mapping Your Own Everest', 'Everyone has their own Everest a challenge that seems impossible until you start climbing. Marc helps individuals and organizations identify their peaks and valleys, then creates roadmaps for the journey. Because the summit is not the point; it is who you become on the way up.', '/src/assets/new-leader-visionary-image.jpg', 4);

-- Carousel slides table (for Failures & Firsts section)
CREATE TABLE public.carousel_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  subcaption TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view carousel slides"
  ON public.carousel_slides FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage carousel slides"
  ON public.carousel_slides FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default carousel slides
INSERT INTO public.carousel_slides (image_url, caption, subcaption, display_order) VALUES
('/src/assets/new-family-image.jpg', 'Father', 'Raising kids who know both peaks & valleys', 1),
('/src/assets/new-builder-image.jpg', 'Builder', 'Creating what does not exist yet', 2),
('/src/assets/new-athlete-image.jpg', 'Athlete', 'Finding limits by pushing past them', 3),
('/src/assets/new-founder-image.jpg', 'Founder', 'Building 29029 from belief to movement', 4),
('/src/assets/new-leader-visionary-image.jpg', 'Leader & Visionary', 'Guiding others to their summits', 5);

-- Movement content table
CREATE TABLE public.movement_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  video_link_url TEXT NOT NULL,
  quote TEXT NOT NULL,
  quote_author TEXT NOT NULL,
  profile_image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.movement_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view movement content"
  ON public.movement_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can update movement content"
  ON public.movement_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default movement content
INSERT INTO public.movement_content (title, description, video_url, video_link_url, quote, quote_author, profile_image_url)
VALUES (
  'THE PEAK IS NOT THE POINT',
  '29029 created a new category. It has redefined who endurance sport was for. And with Marc leading the way it has curated a community of thousands in search of their best self. It is a container for belief, an expression of a broader philosophy - challenge reveals character and care scales transformation.',
  'https://res.cloudinary.com/dlb8cwtfd/video/upload/v1757398003/ssvid_1920x1080_-_02_r63sn4.mp4',
  'https://29029.com',
  'Marc presence is not about the summit it is about the belief he instills that you can climb further than you thought possible.',
  '29029 Community Member',
  '/src/assets/marc-hero-portrait.jpg'
);

-- Podcasts table
CREATE TABLE public.podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  podcast_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view podcasts"
  ON public.podcasts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage podcasts"
  ON public.podcasts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default podcasts
INSERT INTO public.podcasts (title, description, thumbnail_url, podcast_url, display_order) VALUES
('The Everyday Warrior Podcast', 'Discussing leadership, resilience, and building communities through challenge', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400', '#', 1),
('Finding Mastery', 'Exploring peak performance and the mindset of endurance', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', '#', 2),
('The Rich Roll Podcast', 'On creating 29029 and redefining endurance sport', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400', '#', 3);

-- Social posts table
CREATE TABLE public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social posts"
  ON public.social_posts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage social posts"
  ON public.social_posts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default social posts
INSERT INTO public.social_posts (image_url, alt_text, display_order) VALUES
('https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', 'Marc speaking at 29029 event', 1),
('https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400', 'Mountain climbing challenge', 2),
('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400', 'Community gathering', 3),
('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400', 'Speaking engagement', 4);

-- Social links table
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social links"
  ON public.social_links FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage social links"
  ON public.social_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default social links
INSERT INTO public.social_links (name, url, display_order) VALUES
('Instagram', 'https://instagram.com/marchodulich', 1),
('LinkedIn', 'https://linkedin.com/in/marchodulich', 2),
('Twitter', 'https://twitter.com/marchodulich', 3);

-- Contact content table
CREATE TABLE public.contact_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  email TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view contact content"
  ON public.contact_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can update contact content"
  ON public.contact_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default contact content
INSERT INTO public.contact_content (title, description, button_text, email)
VALUES (
  'Say Hello',
  'Reach out about speaking, collaborating, or to share your peak & valley story.',
  'CONTACT MARC',
  'hello@marchodulich.com'
);

-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for cms-images bucket
CREATE POLICY "Public can view cms images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');

CREATE POLICY "Admins can upload cms images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cms images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cms images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));