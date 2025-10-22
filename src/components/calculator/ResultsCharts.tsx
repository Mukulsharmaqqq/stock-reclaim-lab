import { CalculationResults } from "@/types/calculator";
import { formatCurrency } from "@/lib/calculations";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface ResultsChartsProps {
  results: CalculationResults;
  currency: string;
}

const COLORS = {
  primary: "hsl(215, 70%, 25%)",
  secondary: "hsl(180, 65%, 45%)",
  success: "hsl(145, 65%, 45%)",
  warning: "hsl(38, 92%, 50%)",
  destructive: "hsl(350, 75%, 55%)",
};

export function ResultsCharts({ results, currency }: ResultsChartsProps) {
  const marginData = [
    {
      name: "Before",
      margin: Math.max(0, results.originalMargin),
      fill: COLORS.primary,
    },
    {
      name: "After",
      margin: Math.max(0, results.adjustedMargin),
      fill: results.adjustedMargin > results.originalMargin ? COLORS.success : COLORS.destructive,
    },
  ];

  const valueCompositionData = [
    { name: "Adjusted Value", value: results.adjustedInventoryValue, fill: COLORS.success },
    { name: "Write-Down", value: results.totalWriteDown, fill: COLORS.destructive },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Margin Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-card border border-border shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">Margin Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: any) => `${value.toFixed(2)}%`}
            />
            <Bar dataKey="margin" radius={[8, 8, 0, 0]} animationDuration={1000}>
              {marginData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Value Composition Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-card border border-border shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4">Value Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={valueCompositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1000}
            >
              {valueCompositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: any) => formatCurrency(value, currency)}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
