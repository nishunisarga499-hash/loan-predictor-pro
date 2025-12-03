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
    const reasons: { factor: string; impact: string; description: string; severity: 'positive' | 'warning' | 'negative' }[] = [];

    // Credit score factor (0-40 points)
    if (creditScore < 580) {
      riskScore += 40;
      reasons.push({
        factor: 'Credit Score',
        impact: '+40 risk points',
        description: `Very poor credit score (${creditScore}). Scores below 580 indicate high credit risk.`,
        severity: 'negative'
      });
    } else if (creditScore < 670) {
      riskScore += 30;
      reasons.push({
        factor: 'Credit Score',
        impact: '+30 risk points',
        description: `Fair credit score (${creditScore}). Scores between 580-669 indicate moderate credit risk.`,
        severity: 'warning'
      });
    } else if (creditScore < 740) {
      riskScore += 15;
      reasons.push({
        factor: 'Credit Score',
        impact: '+15 risk points',
        description: `Good credit score (${creditScore}). This is within acceptable lending range.`,
        severity: 'warning'
      });
    } else if (creditScore < 800) {
      riskScore += 5;
      reasons.push({
        factor: 'Credit Score',
        impact: '+5 risk points',
        description: `Very good credit score (${creditScore}). Excellent creditworthiness.`,
        severity: 'positive'
      });
    } else {
      reasons.push({
        factor: 'Credit Score',
        impact: '+0 risk points',
        description: `Exceptional credit score (${creditScore}). Outstanding creditworthiness.`,
        severity: 'positive'
      });
    }

    // Debt-to-income ratio factor (0-25 points)
    if (debtToIncomeRatio > 0.5) {
      riskScore += 25;
      reasons.push({
        factor: 'Debt-to-Income Ratio',
        impact: '+25 risk points',
        description: `Very high DTI (${(debtToIncomeRatio * 100).toFixed(1)}%). Ratio above 50% indicates severe debt burden.`,
        severity: 'negative'
      });
    } else if (debtToIncomeRatio > 0.4) {
      riskScore += 18;
      reasons.push({
        factor: 'Debt-to-Income Ratio',
        impact: '+18 risk points',
        description: `High DTI (${(debtToIncomeRatio * 100).toFixed(1)}%). Ratio between 40-50% indicates significant debt.`,
        severity: 'negative'
      });
    } else if (debtToIncomeRatio > 0.3) {
      riskScore += 10;
      reasons.push({
        factor: 'Debt-to-Income Ratio',
        impact: '+10 risk points',
        description: `Moderate DTI (${(debtToIncomeRatio * 100).toFixed(1)}%). Ratio between 30-40% is manageable.`,
        severity: 'warning'
      });
    } else if (debtToIncomeRatio > 0.2) {
      riskScore += 5;
      reasons.push({
        factor: 'Debt-to-Income Ratio',
        impact: '+5 risk points',
        description: `Good DTI (${(debtToIncomeRatio * 100).toFixed(1)}%). Ratio between 20-30% shows healthy finances.`,
        severity: 'positive'
      });
    } else {
      reasons.push({
        factor: 'Debt-to-Income Ratio',
        impact: '+0 risk points',
        description: `Excellent DTI (${(debtToIncomeRatio * 100).toFixed(1)}%). Low debt burden indicates strong finances.`,
        severity: 'positive'
      });
    }

    // Income to loan ratio factor (0-20 points)
    const loanToIncomeRatio = loanAmount / annualIncome;
    if (loanToIncomeRatio > 5) {
      riskScore += 20;
      reasons.push({
        factor: 'Loan-to-Income Ratio',
        impact: '+20 risk points',
        description: `Very high loan amount (${loanToIncomeRatio.toFixed(2)}x income). Requesting more than 5x annual income is risky.`,
        severity: 'negative'
      });
    } else if (loanToIncomeRatio > 3) {
      riskScore += 15;
      reasons.push({
        factor: 'Loan-to-Income Ratio',
        impact: '+15 risk points',
        description: `High loan amount (${loanToIncomeRatio.toFixed(2)}x income). Loan is 3-5x annual income.`,
        severity: 'negative'
      });
    } else if (loanToIncomeRatio > 2) {
      riskScore += 10;
      reasons.push({
        factor: 'Loan-to-Income Ratio',
        impact: '+10 risk points',
        description: `Moderate loan amount (${loanToIncomeRatio.toFixed(2)}x income). Loan is 2-3x annual income.`,
        severity: 'warning'
      });
    } else if (loanToIncomeRatio > 1) {
      riskScore += 5;
      reasons.push({
        factor: 'Loan-to-Income Ratio',
        impact: '+5 risk points',
        description: `Reasonable loan amount (${loanToIncomeRatio.toFixed(2)}x income). Loan is within annual income.`,
        severity: 'positive'
      });
    } else {
      reasons.push({
        factor: 'Loan-to-Income Ratio',
        impact: '+0 risk points',
        description: `Low loan amount (${loanToIncomeRatio.toFixed(2)}x income). Well within repayment capacity.`,
        severity: 'positive'
      });
    }

    // Employment length factor (0-10 points)
    if (employmentLength < 1) {
      riskScore += 10;
      reasons.push({
        factor: 'Employment Length',
        impact: '+10 risk points',
        description: `Very short employment (${employmentLength} years). Less than 1 year indicates job instability.`,
        severity: 'negative'
      });
    } else if (employmentLength < 2) {
      riskScore += 7;
      reasons.push({
        factor: 'Employment Length',
        impact: '+7 risk points',
        description: `Short employment (${employmentLength} years). 1-2 years is below ideal stability.`,
        severity: 'warning'
      });
    } else if (employmentLength < 5) {
      riskScore += 3;
      reasons.push({
        factor: 'Employment Length',
        impact: '+3 risk points',
        description: `Moderate employment (${employmentLength} years). Good job stability.`,
        severity: 'positive'
      });
    } else {
      reasons.push({
        factor: 'Employment Length',
        impact: '+0 risk points',
        description: `Long employment (${employmentLength} years). Excellent job stability.`,
        severity: 'positive'
      });
    }

    // Previous defaults factor (0-5 points)
    if (previousDefaults > 0) {
      const defaultPoints = Math.min(previousDefaults * 5, 5);
      riskScore += defaultPoints;
      reasons.push({
        factor: 'Previous Defaults',
        impact: `+${defaultPoints} risk points`,
        description: `${previousDefaults} previous default(s) on record. History of defaults is a major concern.`,
        severity: 'negative'
      });
    } else {
      reasons.push({
        factor: 'Previous Defaults',
        impact: '+0 risk points',
        description: 'No previous defaults on record. Clean repayment history.',
        severity: 'positive'
      });
    }

    // Normalize risk score to percentage (0-100)
    const defaultProbability = Math.min(riskScore, 100);

    // Determine risk level and approval
    let riskLevel: string;
    let approved: boolean;
    let decisionReason: string;

    if (defaultProbability < 30) {
      riskLevel = 'low';
      approved = true;
      decisionReason = 'Application approved due to low risk profile. Strong financial indicators and creditworthiness meet lending criteria.';
    } else if (defaultProbability < 60) {
      riskLevel = 'medium';
      approved = true;
      decisionReason = 'Application approved with medium risk. Some factors require attention but overall profile is acceptable.';
    } else {
      riskLevel = 'high';
      approved = false;
      decisionReason = 'Application denied due to high risk factors. Multiple indicators suggest elevated probability of default.';
    }

    // Generate personalized recommendations
    const recommendations: { title: string; description: string; priority: 'high' | 'medium' | 'low' }[] = [];

    if (creditScore < 740) {
      recommendations.push({
        title: 'Improve Credit Score',
        description: creditScore < 580 
          ? 'Focus on paying bills on time, reducing credit card balances below 30% utilization, and disputing any errors on your credit report. Consider a secured credit card to rebuild credit.'
          : creditScore < 670
          ? 'Continue making timely payments and keep credit utilization low. Avoid opening new credit accounts unnecessarily.'
          : 'Your credit is good but could be excellent. Maintain low balances and avoid late payments to reach 740+.',
        priority: creditScore < 580 ? 'high' : creditScore < 670 ? 'medium' : 'low'
      });
    }

    if (debtToIncomeRatio > 0.3) {
      recommendations.push({
        title: 'Reduce Debt-to-Income Ratio',
        description: debtToIncomeRatio > 0.5
          ? 'Your debt burden is critical. Prioritize paying off high-interest debts first. Consider debt consolidation or speak with a financial advisor.'
          : debtToIncomeRatio > 0.4
          ? 'Focus on reducing existing debts before taking new loans. Pay more than minimum payments on credit cards and consider balance transfers.'
          : 'Pay down existing debts to get your DTI below 30%. This will significantly improve your loan eligibility.',
        priority: debtToIncomeRatio > 0.4 ? 'high' : 'medium'
      });
    }

    if (loanToIncomeRatio > 2) {
      recommendations.push({
        title: 'Consider a Smaller Loan Amount',
        description: loanToIncomeRatio > 5
          ? 'The requested loan is too high relative to your income. Consider reducing the loan amount by at least 50% or increasing your income sources.'
          : loanToIncomeRatio > 3
          ? 'Try reducing the loan amount to less than 3x your annual income, or wait until your income increases.'
          : 'A loan closer to 2x your annual income would have better approval chances.',
        priority: loanToIncomeRatio > 3 ? 'high' : 'medium'
      });
    }

    if (employmentLength < 2) {
      recommendations.push({
        title: 'Build Employment History',
        description: employmentLength < 1
          ? 'Lenders prefer at least 1-2 years at current job. Consider waiting to apply, or provide additional income documentation if you have a stable employment history.'
          : 'Continue in your current role to build stability. After 2 years, your employment will be viewed more favorably.',
        priority: employmentLength < 1 ? 'high' : 'medium'
      });
    }

    if (previousDefaults > 0) {
      recommendations.push({
        title: 'Address Previous Defaults',
        description: 'Work on rehabilitating your credit by settling any outstanding defaults. Some lenders may consider applications after 2-3 years of clean credit history post-default.',
        priority: 'high'
      });
    }

    if (numberOfOpenAccounts > 5) {
      recommendations.push({
        title: 'Consolidate Credit Accounts',
        description: 'Having many open accounts can indicate overextension. Consider closing unused accounts and consolidating balances to simplify your credit profile.',
        priority: 'low'
      });
    }

    // Add positive reinforcement if doing well
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Maintain Your Strong Profile',
        description: 'Your financial profile is excellent! Continue your current financial habits. Consider shopping for the best interest rates as you qualify for premium loan products.',
        priority: 'low'
      });
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
        decisionReason,
        reasons,
        recommendations,
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