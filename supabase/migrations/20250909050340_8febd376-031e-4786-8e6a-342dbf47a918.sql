-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'alumni', 'admin');

-- Create college reference IDs table
CREATE TABLE public.college_reference_ids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_id TEXT NOT NULL UNIQUE,
  user_type user_role NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES auth.users(id)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_role user_role NOT NULL,
  college_ref_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.college_reference_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for college_reference_ids
CREATE POLICY "Anyone can read unused reference IDs" 
ON public.college_reference_ids 
FOR SELECT 
USING (NOT is_used);

CREATE POLICY "System can update reference IDs" 
ON public.college_reference_ids 
FOR UPDATE 
USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark the college reference ID as used
  UPDATE public.college_reference_ids 
  SET is_used = true, used_at = now(), used_by = NEW.id
  WHERE reference_id = NEW.raw_user_meta_data->>'college_ref_id';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample college reference IDs
INSERT INTO public.college_reference_ids (reference_id, user_type) VALUES
('STU001', 'student'),
('STU002', 'student'),
('STU003', 'student'),
('ALM001', 'alumni'),
('ALM002', 'alumni'),
('ALM003', 'alumni'),
('ADM001', 'admin'),
('ADM002', 'admin');