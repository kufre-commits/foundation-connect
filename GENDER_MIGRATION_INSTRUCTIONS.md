# Gender Field Migration

To enable the "gender" field in the registration form and PDF, the database schema needs to be updated.

## Issue
Registration might fail because the `gender` column does not exist in the `registrations` table in your Supabase database.

## Solution
You need to apply the migration file created at:
`supabase/migrations/20260216170500_add_gender.sql`

### How to apply:
1. **Via Supabase Dashboard**: 
   - Go to the SQL Editor.
   - Run the following SQL:
     ```sql
     ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS gender text;
     ```

2. **Via CLI (if installed)**:
   - Run `supabase db push`

## Backend Function
The `register` edge function (`supabase/functions/register/index.ts`) has also been updated to:
1. Accept the `gender` field.
2. Retry gracefully if the column is missing (to prevent errors before migration is applied).
3. Include `gender` in the response for the PDF generation.
**You must deploy this function for the changes to take effect:**
`supabase functions deploy register`
