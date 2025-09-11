-- Create extended profile tables for alumni and students
CREATE TABLE public.alumni_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  graduation_year INTEGER,
  degree TEXT,
  major TEXT,
  current_job_title TEXT,
  current_company TEXT,
  years_of_experience INTEGER,
  industry TEXT,
  location TEXT,
  linkedin_url TEXT,
  bio TEXT,
  skills TEXT[],
  expertise_areas TEXT[],
  availability_for_mentoring BOOLEAN DEFAULT false,
  preferred_communication TEXT,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  student_id TEXT,
  current_year INTEGER,
  degree_program TEXT,
  major TEXT,
  gpa DECIMAL(3,2),
  expected_graduation_year INTEGER,
  interests TEXT[],
  career_goals TEXT,
  skills TEXT[],
  projects TEXT[],
  internship_experience TEXT,
  extracurricular_activities TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  seeking_mentorship BOOLEAN DEFAULT false,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for alumni_profiles
CREATE POLICY "Alumni can view their own profile" 
ON public.alumni_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Alumni can insert their own profile" 
ON public.alumni_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Alumni can update their own profile" 
ON public.alumni_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all alumni profiles" 
ON public.alumni_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.user_role = 'admin'::user_role
));

-- Create policies for student_profiles
CREATE POLICY "Students can view their own profile" 
ON public.student_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" 
ON public.student_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" 
ON public.student_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all student profiles" 
ON public.student_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.user_role = 'admin'::user_role
));

-- Create triggers for updated_at
CREATE TRIGGER update_alumni_profiles_updated_at
  BEFORE UPDATE ON public.alumni_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment view count (fixing Forum.tsx error)
CREATE OR REPLACE FUNCTION public.increment_view_count(question_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE questions 
  SET view_count = view_count + 1 
  WHERE id = question_id;
$$;