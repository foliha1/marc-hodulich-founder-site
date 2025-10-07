-- Create section_content table for managing section headers
CREATE TABLE public.section_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  paragraph TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view section content"
  ON public.section_content
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update section content"
  ON public.section_content
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial data
INSERT INTO public.section_content (section_name, title, paragraph) VALUES
  ('meet_marc', 'MEET MARC', 'Marc Hodulich is a builder, athlete, and father who believes growth lives at the edge of comfort. His days are guided by simple virtues—curiosity, care, resilience, and presence. Whether starting companies, running ultramarathons, or playing with his boys - Marc leads with the conviction that struggle is a teacher, community is strength, and life is richest when built with intention and shared while fully present with others.'),
  ('failures_firsts', 'FAILURES, FIRSTS, AND FOUNDATIONS', 'Marc''s path as an entrepreneur and athlete proves that failure isn''t the end, it''s the making of a meaningful story. He sold payroll door-to-door in Manhattan, spent years in management consulting while raising millions for pediatric cancer research through The Wall Street Decathlon, and launched BeerFit, a nationwide mash-up of craft beer and fun runs. Each chapter, whether success or setback, was a step toward 29029, built from day one to be more than a race, a brand defined by You vs. You.');