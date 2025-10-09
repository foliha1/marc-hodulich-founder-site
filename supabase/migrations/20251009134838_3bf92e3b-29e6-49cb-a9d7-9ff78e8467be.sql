-- Create table to store pre-approved admin emails
CREATE TABLE public.pre_approved_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on pre_approved_admins
ALTER TABLE public.pre_approved_admins ENABLE ROW LEVEL SECURITY;

-- Only admins can manage pre-approved admins
CREATE POLICY "Admins can manage pre-approved admins"
  ON public.pre_approved_admins FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert Marc's email as pre-approved admin
INSERT INTO public.pre_approved_admins (email)
VALUES ('marc@wdeventures.com');

-- Create function to automatically assign admin role to pre-approved emails
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user's email is in the pre-approved admins list
  IF EXISTS (
    SELECT 1 
    FROM public.pre_approved_admins 
    WHERE LOWER(email) = LOWER(NEW.email)
  ) THEN
    -- Grant admin role to the user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to check for pre-approved admins
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_admin_assignment();