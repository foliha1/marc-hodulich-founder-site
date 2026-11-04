CREATE TABLE public.press_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'press' CHECK (kind IN ('press','linkedin')),
  outlet text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.press_features ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.press_features TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.press_features TO authenticated;
CREATE POLICY "Anyone can view press features" ON public.press_features FOR SELECT USING (true);
CREATE POLICY "Admins manage press features" ON public.press_features FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));