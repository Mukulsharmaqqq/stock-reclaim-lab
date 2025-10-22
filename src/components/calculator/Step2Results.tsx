import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryInputs, CalculationResults, ReportData } from "@/types/calculator";
import { calculateInventoryValues, formatCurrency } from "@/lib/calculations";
import { ResultsCharts } from "./ResultsCharts";
import { motion } from "framer-motion";
import { Download, ArrowLeft, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Step2ResultsProps {
  inputs: InventoryInputs;
  onBack: () => void;
}

export function Step2Results({ inputs, onBack }: Step2ResultsProps) {
  const results = calculateInventoryValues(inputs);
  const [reportData, setReportData] = useState<ReportData>({
    fullName: "",
    email: "",
    companyName: "",
    consent: false,
  });

  const metrics = [
    {
      label: "Cost Basis",
      value: formatCurrency(results.costBasis, inputs.currency),
      icon: CheckCircle2,
      color: "text-primary",
    },
    {
      label: "Net Realizable Value",
      value: formatCurrency(results.netRealizableValue, inputs.currency),
      icon: TrendingDown,
      color: "text-secondary",
    },
    {
      label: "Age-Adjusted Value",
      value: formatCurrency(results.ageAdjustedValue, inputs.currency),
      icon: TrendingDown,
      color: "text-accent",
    },
    {
      label: "Adjusted Inventory Value",
      value: formatCurrency(results.adjustedInventoryValue, inputs.currency),
      icon: CheckCircle2,
      color: "text-success",
      highlight: true,
    },
    {
      label: "Total Write-Down",
      value: formatCurrency(results.totalWriteDown, inputs.currency),
      icon: AlertTriangle,
      color: "text-destructive",
      highlight: true,
    },
    {
      label: "Capital Locked",
      value: `${results.capitalLockedPercent.toFixed(1)}%`,
      icon: AlertTriangle,
      color: "text-warning",
    },
  ];

  const handleDownloadPDF = async () => {
    if (!reportData.fullName || !reportData.email || !reportData.consent) {
      toast.error("Please fill in all required fields and accept the consent");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reportData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const pdf = new jsPDF();
      
      // Header
      pdf.setFillColor(215 * 255 / 360, 70 * 255 / 100, 25 * 255 / 100);
      pdf.rect(0, 0, 210, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text("Inventory Valuation Report", 20, 25);

      // Reset text color
      pdf.setTextColor(0, 0, 0);
      
      // Report Info
      pdf.setFontSize(12);
      pdf.text(`Generated for: ${reportData.fullName}`, 20, 55);
      if (reportData.companyName) {
        pdf.text(`Company: ${reportData.companyName}`, 20, 62);
      }
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, reportData.companyName ? 69 : 62);

      // Key Metrics
      pdf.setFontSize(16);
      pdf.text("Key Metrics", 20, 85);
      
      let yPos = 95;
      pdf.setFontSize(11);
      
      metrics.forEach((metric, index) => {
        pdf.text(`${metric.label}: ${metric.value}`, 25, yPos);
        yPos += 8;
      });

      // Insights
      yPos += 10;
      pdf.setFontSize(16);
      pdf.text("Key Insights", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      const insights = [
        `You currently have ${formatCurrency(results.totalWriteDown, inputs.currency)} tied up in slow-moving stock.`,
        `Adjusted value is ${((results.adjustedInventoryValue / results.costBasis) * 100).toFixed(1)}% of your original cost.`,
        `If sold at current market, margin would change by ${Math.abs(results.marginImpact).toFixed(2)} percentage points.`,
      ];

      insights.forEach(insight => {
        const lines = pdf.splitTextToSize(insight, 170);
        pdf.text(lines, 25, yPos);
        yPos += lines.length * 7;
      });

      // Recommendations
      yPos += 10;
      pdf.setFontSize(16);
      pdf.text("Recommendations", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      const recommendations = [
        results.capitalLockedPercent > 30 
          ? "• Consider liquidating or repurposing this inventory urgently"
          : "• Monitor this inventory closely to prevent further devaluation",
        "• Review pricing strategy for similar future inventory",
        "• Implement age-based monitoring for all inventory items",
      ];

      recommendations.forEach(rec => {
        const lines = pdf.splitTextToSize(rec, 170);
        pdf.text(lines, 25, yPos);
        yPos += lines.length * 7;
      });

      // Footer
      pdf.setFontSize(9);
      pdf.setTextColor(128, 128, 128);
      pdf.text("Generated by Inventory Valuation Calculator", 105, 285, { align: "center" });

      pdf.save(`inventory-report-${Date.now()}.pdf`);
      toast.success("PDF report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <Button variant="outline" onClick={onBack} className="group">
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Inputs
      </Button>

      {/* Key Metrics */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Valuation Results</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 ${metric.highlight ? 'border-2 border-primary shadow-lg' : 'border-border shadow-sm'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <ResultsCharts results={results} currency={inputs.currency} />

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              • You currently have <span className="font-semibold text-destructive">{formatCurrency(results.totalWriteDown, inputs.currency)}</span> tied up in slow-moving stock.
            </p>
            <p className="text-muted-foreground">
              • Adjusted value is <span className="font-semibold text-primary">{((results.adjustedInventoryValue / results.costBasis) * 100).toFixed(1)}%</span> of your original cost.
            </p>
            <p className="text-muted-foreground">
              • If sold at current market, margin would change by <span className={`font-semibold ${results.marginImpact > 0 ? 'text-success' : 'text-destructive'}`}>{Math.abs(results.marginImpact).toFixed(2)} percentage points</span>.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Download Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-6">Download PDF Report</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={reportData.fullName}
                onChange={(e) => setReportData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={reportData.email}
                onChange={(e) => setReportData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@company.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="companyName">Company Name (Optional)</Label>
              <Input
                id="companyName"
                value={reportData.companyName}
                onChange={(e) => setReportData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Acme Manufacturing"
              />
            </div>

            <div className="flex items-start space-x-3 md:col-span-2">
              <Checkbox
                id="consent"
                checked={reportData.consent}
                onCheckedChange={(checked) => setReportData(prev => ({ ...prev, consent: checked as boolean }))}
              />
              <Label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                Send me the report and updates about inventory management best practices.
              </Label>
            </div>
          </div>

          <Button onClick={handleDownloadPDF} size="lg" className="w-full group">
            <Download className="mr-2 h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
            Download PDF Report
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
