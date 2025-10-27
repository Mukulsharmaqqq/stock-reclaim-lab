import { Card } from "@/components/ui/card";
import { InventoryInputs } from "@/types/calculator";
import { calculateInventoryValues, formatCurrency } from "@/lib/calculations";
import { motion } from "framer-motion";
import { TrendingDown, AlertCircle } from "lucide-react";

interface LivePreviewProps {
  inputs: InventoryInputs;
}

export function LivePreview({ inputs }: LivePreviewProps) {
  const results = calculateInventoryValues(inputs);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 sticky top-6 bg-card border-border shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <TrendingDown className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-lg">Live Preview</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">Projected Adjusted Value</div>
              <motion.div
                key={results.adjustedInventoryValue}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-primary"
              >
                {formatCurrency(results.adjustedInventoryValue, inputs.currency)}
              </motion.div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cost Basis</span>
                <span className="font-medium">{formatCurrency(results.costBasis, inputs.currency)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Write-Down</span>
                <span className="font-medium text-destructive">
                  -{formatCurrency(results.totalWriteDown, inputs.currency)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Capital Locked</span>
                <span className="font-medium text-warning">
                  {results.capitalLockedPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {results.totalWriteDown > results.costBasis * 0.3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20"
              >
                <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-warning-foreground leading-relaxed">
                  Significant write-down detected. Consider reviewing your inputs.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
