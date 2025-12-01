import { useState } from "react";
import { LoanForm, LoanFormData } from "@/components/LoanForm";
import { PredictionResult } from "@/components/PredictionResult";
import { PredictionHistory } from "@/components/PredictionHistory";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";

interface PredictionResponse {
  defaultProbability: number;
  riskLevel: string;
  approved: boolean;
  factors: {
    creditScore: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    employmentLength: number;
    previousDefaults: number;
  };
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: LoanFormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('predict-loan-default', {
        body: formData
      });

      if (error) throw error;

      setPredictionResult(data);
      toast({
        title: "Prediction Complete",
        description: `Risk Level: ${data.riskLevel.toUpperCase()} - ${data.approved ? 'Approved' : 'Denied'}`,
      });

      // Refresh history
      window.dispatchEvent(new Event('prediction-complete'));
    } catch (error) {
      console.error('Error predicting loan default:', error);
      toast({
        title: "Error",
        description: "Failed to predict loan default. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Loan Default Predictor
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Advanced ML-powered risk assessment for loan applications. Make informed lending decisions with real-time analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ML-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms analyze multiple risk factors
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Real-Time Results</h3>
              <p className="text-sm text-muted-foreground">
                Instant risk assessment and approval decisions
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Visual Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive charts and risk factor breakdown
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Loan Application Details</h2>
            <LoanForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {predictionResult && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
              <PredictionResult result={predictionResult} />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">History</h2>
            <PredictionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;