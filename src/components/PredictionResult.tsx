import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Download, Lightbulb } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface Reason {
  factor: string;
  impact: string;
  description: string;
  severity: 'positive' | 'warning' | 'negative';
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface PredictionResultProps {
  result: {
    defaultProbability: number;
    riskLevel: string;
    approved: boolean;
    decisionReason?: string;
    reasons?: Reason[];
    recommendations?: Recommendation[];
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
  const { defaultProbability, riskLevel, approved, factors, decisionReason, reasons, recommendations } = result;
  const { toast } = useToast();

  const getSeverityStyles = (severity: Reason['severity']) => {
    switch (severity) {
      case 'positive': return 'border-l-success bg-success/10';
      case 'warning': return 'border-l-warning bg-warning/10';
      case 'negative': return 'border-l-destructive bg-destructive/10';
    }
  };

  const getSeverityIcon = (severity: Reason['severity']) => {
    switch (severity) {
      case 'positive': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'negative': return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getPriorityStyles = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-destructive bg-destructive/10';
      case 'medium': return 'border-l-warning bg-warning/10';
      case 'low': return 'border-l-primary bg-primary/10';
    }
  };

  const getPriorityBadge = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case 'medium': return <Badge variant="outline" className="text-xs border-warning text-warning">Medium Priority</Badge>;
      case 'low': return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
    }
  };

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Default Prediction Report", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 32, { align: "center" });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Decision Section
    let yPos = 55;
    
    if (approved) {
      doc.setFillColor(220, 252, 231);
    } else {
      doc.setFillColor(254, 226, 226);
    }
    doc.roundedRect(15, yPos - 8, pageWidth - 30, 25, 3, 3, 'F');
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    if (approved) {
      doc.setTextColor(22, 163, 74);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(
      approved ? "LOAN APPROVED" : "LOAN DENIED",
      pageWidth / 2,
      yPos + 5,
      { align: "center" }
    );

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPos += 35;

    // Risk Assessment Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Assessment Summary", 15, yPos);
    yPos += 10;

    doc.setDrawColor(229, 231, 235);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    // Risk metrics
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const metrics = [
      { label: "Default Probability", value: `${defaultProbability.toFixed(1)}%` },
      { label: "Risk Level", value: riskLevel.toUpperCase() },
      { label: "Decision", value: approved ? "Approved" : "Denied" }
    ];

    metrics.forEach((metric, index) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(metric.label + ":", 15, yPos);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(metric.value, 80, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Key Risk Factors Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Key Risk Factors", 15, yPos);
    yPos += 10;

    doc.setDrawColor(229, 231, 235);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    const riskFactors = [
      { label: "Credit Score", value: factors.creditScore.toString() },
      { label: "Debt-to-Income Ratio", value: `${(factors.debtToIncomeRatio * 100).toFixed(1)}%` },
      { label: "Loan-to-Income Ratio", value: factors.loanToIncomeRatio.toFixed(2) },
      { label: "Employment Length", value: `${factors.employmentLength} years` },
      { label: "Previous Defaults", value: factors.previousDefaults.toString() }
    ];

    doc.setFontSize(11);
    riskFactors.forEach((factor) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(factor.label + ":", 15, yPos);
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(factor.value, 80, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Decision Reason
    if (decisionReason) {
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(15, yPos, pageWidth - 30, 20, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      const decisionText = doc.splitTextToSize(decisionReason, pageWidth - 50);
      doc.text(decisionText, 20, yPos + 8);
      yPos += 30;
    }

    // Detailed Analysis Section
    if (reasons && reasons.length > 0) {
      // Check if we need a new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Detailed Factor Analysis", 15, yPos);
      yPos += 10;

      doc.setDrawColor(229, 231, 235);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;

      reasons.forEach((reason) => {
        // Check if we need a new page
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        // Severity indicator color
        if (reason.severity === 'positive') {
          doc.setFillColor(220, 252, 231);
          doc.setDrawColor(22, 163, 74);
        } else if (reason.severity === 'warning') {
          doc.setFillColor(254, 249, 195);
          doc.setDrawColor(202, 138, 4);
        } else {
          doc.setFillColor(254, 226, 226);
          doc.setDrawColor(220, 38, 38);
        }

        // Draw reason box with left border
        doc.setLineWidth(0.5);
        doc.roundedRect(15, yPos, pageWidth - 30, 22, 2, 2, 'F');
        doc.setLineWidth(2);
        doc.line(15, yPos, 15, yPos + 22);

        // Factor name and impact
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(reason.factor, 20, yPos + 7);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        doc.text(reason.impact, pageWidth - 20, yPos + 7, { align: "right" });

        // Description
        doc.setFontSize(8);
        doc.setTextColor(75, 85, 99);
        const descText = doc.splitTextToSize(reason.description, pageWidth - 50);
        doc.text(descText, 20, yPos + 14);

        yPos += 26;
      });
    }

    // Recommendations Section
    if (recommendations && recommendations.length > 0) {
      // Check if we need a new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Recommendations to Improve Eligibility", 15, yPos);
      yPos += 10;

      doc.setDrawColor(229, 231, 235);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;

      recommendations.forEach((rec) => {
        // Check if we need a new page
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }

        // Priority indicator color
        if (rec.priority === 'high') {
          doc.setFillColor(254, 226, 226);
          doc.setDrawColor(220, 38, 38);
        } else if (rec.priority === 'medium') {
          doc.setFillColor(254, 249, 195);
          doc.setDrawColor(202, 138, 4);
        } else {
          doc.setFillColor(219, 234, 254);
          doc.setDrawColor(37, 99, 235);
        }

        // Draw recommendation box with left border
        doc.setLineWidth(0.5);
        doc.roundedRect(15, yPos, pageWidth - 30, 26, 2, 2, 'F');
        doc.setLineWidth(2);
        doc.line(15, yPos, 15, yPos + 26);

        // Title and priority
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(rec.title, 20, yPos + 7);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128);
        const priorityText = rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1) + ' Priority';
        doc.text(priorityText, pageWidth - 20, yPos + 7, { align: "right" });

        // Description
        doc.setFontSize(8);
        doc.setTextColor(75, 85, 99);
        const recText = doc.splitTextToSize(rec.description, pageWidth - 50);
        doc.text(recText, 20, yPos + 14);

        yPos += 30;
      });
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);
      
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text("This report is generated by Loan Default Predictor - For informational purposes only", pageWidth / 2, footerY, { align: "center" });
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, footerY + 5, { align: "center" });
    }

    // Save the PDF
    doc.save(`loan-prediction-report-${Date.now()}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your prediction report has been downloaded.",
    });
  };

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
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
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

        {/* Decision Summary */}
        <div className={`p-4 rounded-lg ${approved ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <p className={`font-semibold ${approved ? 'text-success' : 'text-destructive'}`}>
            {approved 
              ? '✓ Loan Application Approved' 
              : '✗ Loan Application Denied'}
          </p>
          {decisionReason && (
            <p className="text-sm text-muted-foreground mt-2">{decisionReason}</p>
          )}
        </div>

        {/* Detailed Reasons */}
        {reasons && reasons.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Detailed Analysis</h4>
            <div className="space-y-2">
              {reasons.map((reason, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${getSeverityStyles(reason.severity)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(reason.severity)}
                      <span className="font-medium">{reason.factor}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reason.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recommendations to Improve Eligibility
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${getPriorityStyles(rec.priority)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{rec.title}</span>
                    {getPriorityBadge(rec.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
