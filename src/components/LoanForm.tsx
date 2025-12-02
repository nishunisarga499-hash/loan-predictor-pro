import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => Promise<void>;
  isLoading: boolean;
}

export interface LoanFormData {
  loanAmount: number;
  annualIncome: number;
  creditScore: number;
  employmentLength: number;
  debtToIncomeRatio: number;
  numberOfOpenAccounts: number;
  previousDefaults: number;
  loanPurpose: string;
}

export function LoanForm({ onSubmit, isLoading }: LoanFormProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    loanAmount: 500000,
    annualIncome: 600000,
    creditScore: 700,
    employmentLength: 3,
    debtToIncomeRatio: 0.35,
    numberOfOpenAccounts: 5,
    previousDefaults: 0,
    loanPurpose: "home"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateField = (field: keyof LoanFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 shadow-custom">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={formData.loanAmount}
              onChange={(e) => updateField('loanAmount', Number(e.target.value))}
              min="50000"
              step="50000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualIncome">Annual Income (₹)</Label>
            <Input
              id="annualIncome"
              type="number"
              value={formData.annualIncome}
              onChange={(e) => updateField('annualIncome', Number(e.target.value))}
              min="100000"
              step="50000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditScore">Credit Score (300-850)</Label>
            <Input
              id="creditScore"
              type="number"
              value={formData.creditScore}
              onChange={(e) => updateField('creditScore', Number(e.target.value))}
              min="300"
              max="850"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentLength">Employment Length (years)</Label>
            <Input
              id="employmentLength"
              type="number"
              value={formData.employmentLength}
              onChange={(e) => updateField('employmentLength', Number(e.target.value))}
              min="0"
              max="50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debtToIncomeRatio">Debt-to-Income Ratio (0-1)</Label>
            <Input
              id="debtToIncomeRatio"
              type="number"
              value={formData.debtToIncomeRatio}
              onChange={(e) => updateField('debtToIncomeRatio', Number(e.target.value))}
              step="0.01"
              min="0"
              max="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfOpenAccounts">Number of Open Accounts</Label>
            <Input
              id="numberOfOpenAccounts"
              type="number"
              value={formData.numberOfOpenAccounts}
              onChange={(e) => updateField('numberOfOpenAccounts', Number(e.target.value))}
              min="0"
              max="50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousDefaults">Previous Defaults</Label>
            <Input
              id="previousDefaults"
              type="number"
              value={formData.previousDefaults}
              onChange={(e) => updateField('previousDefaults', Number(e.target.value))}
              min="0"
              max="10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanPurpose">Loan Purpose</Label>
            <Select value={formData.loanPurpose} onValueChange={(value) => updateField('loanPurpose', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Purchase</SelectItem>
                <SelectItem value="auto">Auto Loan</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="debt">Debt Consolidation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full gradient-hero hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Predict Default Risk'
          )}
        </Button>
      </form>
    </Card>
  );
}