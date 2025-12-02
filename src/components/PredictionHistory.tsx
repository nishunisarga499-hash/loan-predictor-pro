import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { History, TrendingUp, TrendingDown } from "lucide-react";

interface Prediction {
  id: string;
  loan_amount: number;
  annual_income: number;
  credit_score: number;
  default_probability: number;
  risk_level: string;
  approved: boolean;
  created_at: string;
}

export function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('loan_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No prediction history yet. Make your first prediction above!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-custom">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <History className="h-5 w-5" />
        Recent Predictions
      </h3>
      <div className="space-y-3">
        {predictions.map((pred) => (
          <div 
            key={pred.id} 
            className="p-4 bg-gradient-card rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {pred.approved ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
                <span className="font-semibold">
                  ₹{pred.loan_amount.toLocaleString('en-IN')}
                </span>
              </div>
              <Badge variant={getRiskBadgeVariant(pred.risk_level)}>
                {pred.risk_level}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="block">Income</span>
                <span className="font-medium text-foreground">
                  ₹{pred.annual_income.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="block">Credit Score</span>
                <span className="font-medium text-foreground">
                  {pred.credit_score}
                </span>
              </div>
              <div>
                <span className="block">Risk</span>
                <span className="font-medium text-foreground">
                  {pred.default_probability.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(pred.created_at), { addSuffix: true })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}