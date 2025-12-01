import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      loanAmount,
      annualIncome,
      creditScore,
      employmentLength,
      debtToIncomeRatio,
      numberOfOpenAccounts,
      previousDefaults,
      loanPurpose
    } = await req.json();

    console.log('Received prediction request:', { loanAmount, annualIncome, creditScore });

    // ML-based risk calculation using multiple factors
    let riskScore = 0;

    // Credit score factor (0-40 points)
    if (creditScore < 580) riskScore += 40;
    else if (creditScore < 670) riskScore += 30;
    else if (creditScore < 740) riskScore += 15;
    else if (creditScore < 800) riskScore += 5;

    // Debt-to-income ratio factor (0-25 points)
    if (debtToIncomeRatio > 0.5) riskScore += 25;
    else if (debtToIncomeRatio > 0.4) riskScore += 18;
    else if (debtToIncomeRatio > 0.3) riskScore += 10;
    else if (debtToIncomeRatio > 0.2) riskScore += 5;

    // Income to loan ratio factor (0-20 points)
    const loanToIncomeRatio = loanAmount / annualIncome;
    if (loanToIncomeRatio > 5) riskScore += 20;
    else if (loanToIncomeRatio > 3) riskScore += 15;
    else if (loanToIncomeRatio > 2) riskScore += 10;
    else if (loanToIncomeRatio > 1) riskScore += 5;

    // Employment length factor (0-10 points)
    if (employmentLength < 1) riskScore += 10;
    else if (employmentLength < 2) riskScore += 7;
    else if (employmentLength < 5) riskScore += 3;

    // Previous defaults factor (0-5 points)
    riskScore += Math.min(previousDefaults * 5, 5);

    // Normalize risk score to percentage (0-100)
    const defaultProbability = Math.min(riskScore, 100);

    // Determine risk level and approval
    let riskLevel: string;
    let approved: boolean;

    if (defaultProbability < 30) {
      riskLevel = 'low';
      approved = true;
    } else if (defaultProbability < 60) {
      riskLevel = 'medium';
      approved = true;
    } else {
      riskLevel = 'high';
      approved = false;
    }

    // Store prediction in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    let userId = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    if (userId) {
      const { error: insertError } = await supabase
        .from('loan_predictions')
        .insert({
          user_id: userId,
          loan_amount: loanAmount,
          annual_income: annualIncome,
          credit_score: creditScore,
          employment_length: employmentLength,
          debt_to_income_ratio: debtToIncomeRatio,
          number_of_open_accounts: numberOfOpenAccounts,
          previous_defaults: previousDefaults,
          loan_purpose: loanPurpose,
          default_probability: defaultProbability,
          risk_level: riskLevel,
          approved: approved
        });

      if (insertError) {
        console.error('Error storing prediction:', insertError);
      } else {
        console.log('Prediction stored successfully');
      }
    }

    return new Response(
      JSON.stringify({
        defaultProbability,
        riskLevel,
        approved,
        factors: {
          creditScore,
          debtToIncomeRatio,
          loanToIncomeRatio,
          employmentLength,
          previousDefaults
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in predict-loan-default function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});