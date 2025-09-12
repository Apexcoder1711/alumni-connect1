-- Add credit_points to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN credit_points integer DEFAULT 0;

-- Create timetables table
CREATE TABLE public.timetables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT[] DEFAULT '{}',
  schedule JSONB NOT NULL DEFAULT '{}',
  is_ai_generated BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

-- Create policies for timetables
CREATE POLICY "Students can view their own timetables" 
ON public.timetables 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can create their own timetables" 
ON public.timetables 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own timetables" 
ON public.timetables 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Students can delete their own timetables" 
ON public.timetables 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create student_projects table
CREATE TABLE public.student_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  skills_used TEXT[] DEFAULT '{}',
  project_url TEXT,
  github_url TEXT,
  is_validated BOOLEAN DEFAULT false,
  validation_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  admin_feedback TEXT,
  credit_points_earned INTEGER DEFAULT 0,
  timetable_id UUID REFERENCES public.timetables(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for student_projects
CREATE POLICY "Students can view their own projects" 
ON public.student_projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can create their own projects" 
ON public.student_projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own projects" 
ON public.student_projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all projects" 
ON public.student_projects 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.user_role = 'admin'::user_role
));

CREATE POLICY "Admins can update project validation" 
ON public.student_projects 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.user_role = 'admin'::user_role
));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_timetables_updated_at
BEFORE UPDATE ON public.timetables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_projects_updated_at
BEFORE UPDATE ON public.student_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();