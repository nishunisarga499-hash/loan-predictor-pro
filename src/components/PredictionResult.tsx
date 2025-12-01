import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

interface PredictionResultProps {
  result: {
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
  };
}

export function PredictionResult({ result }: PredictionResultProps) {
  const { defaultProbability, riskLevel, approved, factors } = result;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const chartData = [
    { name: 'Default Risk', value: defaultProbability, color: 'hsl(var(--destructive))' },
    { name: 'Approval Score', value: 100 - defaultProbability, color: 'hsl(var(--success))' }
  ];

  return (
    <Card className="p-6 shadow-custom-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Risk Assessment</h3>
            <Badge variant={getRiskColor(riskLevel) as any} className="text-sm">
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {approved ? (
              <CheckCircle2 className="h-12 w-12 text-success" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-5xl font-bold text-primary mb-2">
                {defaultProbability.toFixed(1)}%
              </div>
              <div className="text-muted-foreground">Default Probability</div>
            </div>
          </div>

          <div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Key Risk Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Credit Score</div>
              <div className="text-xl font-semibold">{factors.creditScore}</div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Debt-to-Income</div>
              <div className="text-xl font-semibold">{(factors.debtToIncomeRatio * 100).toFixed(1)}%</div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Loan-to-Income Ratio</div>
              <div className="text-xl font-semibold">{factors.loanToIncomeRatio.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Employment Length</div>
              <div className="text-xl font-semibold">{factors.employmentLength} years</div>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${approved ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <p className={`font-semibold ${approved ? 'text-success' : 'text-destructive'}`}>
            {approved 
              ? '✓ Loan Application Approved - Low to Medium Risk' 
              : '✗ Loan Application Denied - High Risk of Default'}
          </p>
        </div>
      </div>
    </Card>
  );
}