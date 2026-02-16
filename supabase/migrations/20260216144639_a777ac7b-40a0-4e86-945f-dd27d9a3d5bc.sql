-- Add unique constraint on email
ALTER TABLE public.registrations ADD CONSTRAINT registrations_email_unique UNIQUE (email);
