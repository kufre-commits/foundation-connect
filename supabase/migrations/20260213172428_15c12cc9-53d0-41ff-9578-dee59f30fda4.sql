
-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  form_uploaded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can see registered people)
CREATE POLICY "Anyone can view registrations"
  ON public.registrations FOR SELECT
  USING (true);

-- Public insert policy (anyone can register)
CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- Public update policy (for marking form uploaded)
CREATE POLICY "Anyone can update their registration"
  ON public.registrations FOR UPDATE
  USING (true);
