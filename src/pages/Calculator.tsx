import { useState } from "react";
import { InventoryInputs } from "@/types/calculator";
import { Step1Input } from "@/components/calculator/Step1Input";
import { Step2Results } from "@/components/calculator/Step2Results";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

const Calculator = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<InventoryInputs | null>(null);

  const handleNext = (data: InventoryInputs) => {
    setInputs(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">Inventory Valuation Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Find how much capital is locked in obsolete stock and unlock it in minutes
            </p>
          </div>
        </div>
      </motion.header>

      {/* Progress Indicator */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 max-w-md mx-auto">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <span className="font-medium text-sm">Input Data</span>
            </div>
            <div className={`h-0.5 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-border'} transition-colors duration-500`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <span className="font-medium text-sm">Results & Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {step === 1 && <Step1Input onNext={handleNext} />}
        {step === 2 && inputs && <Step2Results inputs={inputs} onBack={handleBack} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Inventory Valuation Calculator. Professional financial analysis tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
