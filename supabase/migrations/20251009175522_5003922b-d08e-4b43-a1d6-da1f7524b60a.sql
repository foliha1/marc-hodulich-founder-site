-- Add explicit SELECT policy for pre_approved_admins table
-- This prevents non-admins from viewing the list of admin emails
CREATE POLICY "Only admins can view pre-approved admins" 
ON public.pre_approved_admins 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));