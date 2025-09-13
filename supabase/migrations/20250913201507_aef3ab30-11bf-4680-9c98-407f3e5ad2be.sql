-- Create startup ideas table
CREATE TABLE public.startup_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_statement TEXT NOT NULL,
  solution TEXT NOT NULL,
  target_market TEXT,
  business_model TEXT,
  funding_needed DECIMAL(15,2),
  equity_offered DECIMAL(5,2),
  stage TEXT CHECK (stage IN ('idea', 'prototype', 'mvp', 'growth')) DEFAULT 'idea',
  industry TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  requires_nda BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  view_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create NDA agreements table
CREATE TABLE public.nda_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_idea_id UUID NOT NULL REFERENCES public.startup_ideas(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  status TEXT CHECK (status IN ('pending', 'signed', 'rejected')) DEFAULT 'pending',
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(startup_idea_id, requester_id)
);

-- Create startup connections table (for investors, partners, interns interest)
CREATE TABLE public.startup_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_idea_id UUID NOT NULL REFERENCES public.startup_ideas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  connection_type TEXT CHECK (connection_type IN ('investor', 'partner', 'intern', 'mentor')) NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('interested', 'connected', 'rejected')) DEFAULT 'interested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(startup_idea_id, user_id)
);

-- Enable RLS
ALTER TABLE public.startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nda_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for startup_ideas
CREATE POLICY "Users can create their own startup ideas"
ON public.startup_ideas
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own startup ideas"
ON public.startup_ideas
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own startup ideas"
ON public.startup_ideas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Public ideas are viewable by authenticated users"
ON public.startup_ideas
FOR SELECT
USING (is_public = true AND is_active = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Ideas with signed NDA are viewable"
ON public.startup_ideas
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  is_active = true AND
  (
    is_public = true OR
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.nda_agreements 
      WHERE startup_idea_id = id 
      AND requester_id = auth.uid() 
      AND status = 'signed'
    )
  )
);

-- RLS Policies for nda_agreements
CREATE POLICY "Users can create NDA requests"
ON public.nda_agreements
FOR INSERT
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Owners can update NDA status"
ON public.nda_agreements
FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can view their own NDAs"
ON public.nda_agreements
FOR SELECT
USING (auth.uid() = requester_id OR auth.uid() = owner_id);

-- RLS Policies for startup_connections
CREATE POLICY "Users can create connections"
ON public.startup_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Startup owners can view connections to their ideas"
ON public.startup_connections
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.startup_ideas 
    WHERE id = startup_idea_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Startup owners can update connection status"
ON public.startup_connections
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.startup_ideas 
    WHERE id = startup_idea_id AND user_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_startup_ideas_updated_at
BEFORE UPDATE ON public.startup_ideas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add user_type enum values for investors, partners, interns
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'investor';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'partner';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'intern';