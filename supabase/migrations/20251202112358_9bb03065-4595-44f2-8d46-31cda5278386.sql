-- Enable RLS on loan_predictions
ALTER TABLE public.loan_predictions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own predictions
CREATE POLICY "Users can view their own predictions"
ON public.loan_predictions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own predictions
CREATE POLICY "Users can insert their own predictions"
ON public.loan_predictions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own predictions
CREATE POLICY "Users can update their own predictions"
ON public.loan_predictions
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own predictions
CREATE POLICY "Users can delete their own predictions"
ON public.loan_predictions
FOR DELETE
USING (auth.uid() = user_id);