CREATE TABLE public.entrepreneurial_milestones (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL DEFAULT '',
 contextual_label text NOT NULL DEFAULT '',
 description text NOT NULL DEFAULT '',
 display_order integer NOT NULL DEFAULT 1,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.entrepreneurial_milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.entrepreneurial_milestones TO authenticated;
GRANT ALL ON public.entrepreneurial_milestones TO service_role;
ALTER TABLE public.entrepreneurial_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view entrepreneurial milestones" ON public.entrepreneurial_milestones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage entrepreneurial milestones" ON public.entrepreneurial_milestones FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
COMMENT ON TABLE public.carousel_slides IS 'DEPRECATED: homepage Failures & Firsts now uses entrepreneurial_milestones; legacy slide records and media retained unchanged.';
