CREATE TABLE loan_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  loan_amount numeric NOT NULL,
  annual_income numeric NOT NULL,
  credit_score integer NOT NULL,
  employment_length integer NOT NULL,
  debt_to_income_ratio numeric NOT NULL,
  number_of_open_accounts integer NOT NULL,
  previous_defaults integer NOT NULL DEFAULT 0,
  loan_purpose text NOT NULL,
  default_probability numeric NOT NULL,
  risk_level text NOT NULL,
  approved boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);