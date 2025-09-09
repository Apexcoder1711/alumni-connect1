-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Mark the college reference ID as used
  UPDATE public.college_reference_ids 
  SET is_used = true, used_at = now(), used_by = NEW.id
  WHERE reference_id = NEW.raw_user_meta_data->>'college_ref_id';
  
  RETURN NEW;
END;
$$;