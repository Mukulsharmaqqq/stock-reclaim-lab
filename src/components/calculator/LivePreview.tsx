import { Card } from "@/components/ui/card";
import { InventoryInputs } from "@/types/calculator";
import { calculateInventoryValues, formatCurrency } from "@/lib/calculations";
import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

interface LivePreviewProps {
  inputs: InventoryInputs;
}

export function LivePreview({ inputs }: LivePreviewProps) {
  const results = calculateInventoryValues(inputs);

  return (
    <motion.div
      key={`${inputs.ageMonths}-${inputs.originalCost}-${inputs.currentMarketValue}`}
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
                <motion.span 
                  key={`cost-${results.costBasis}`}
                  initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
                  animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                  transition={{ duration: 0.3 }}
                  className="font-medium"
                >
                  {formatCurrency(results.costBasis, inputs.currency)}
                </motion.span>
              </div>

              <div className="flex justify-between items-center p-2 rounded-md bg-warning/10 border border-warning/20">
                <span className="text-sm font-medium">Age Reserve Applied</span>
                <motion.span 
                  key={`age-${inputs.ageMonths}`}
                  initial={{ scale: 1.3, backgroundColor: "hsl(var(--warning) / 0.3)" }}
                  animate={{ scale: 1, backgroundColor: "transparent" }}
                  transition={{ duration: 0.4 }}
                  className="font-bold text-lg text-warning px-2 py-0.5 rounded"
                >
                  {inputs.ageMonths < 3 ? '0%' : inputs.ageMonths < 6 ? '10%' : inputs.ageMonths < 12 ? '25%' : '50%'}
                </motion.span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Write-Down</span>
                <motion.span 
                  key={`writedown-${results.totalWriteDown}`}
                  initial={{ scale: 1.1, color: "hsl(var(--destructive))" }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-medium text-destructive"
                >
                  -{formatCurrency(results.totalWriteDown, inputs.currency)}
                </motion.span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Capital Locked</span>
                <motion.span 
                  key={`capital-${results.capitalLockedPercent}`}
                  initial={{ scale: 1.1, color: "hsl(var(--warning))" }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-medium text-warning"
                >
                  {results.capitalLockedPercent.toFixed(1)}%
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
