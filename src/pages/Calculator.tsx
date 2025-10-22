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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Inventory Valuation Calculator</h1>
              <p className="text-sm text-muted-foreground">
                Discover how much capital is locked in obsolete stock—and unlock it in minutes
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Progress Indicator */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 ${step >= 1 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}`}>
                1
              </div>
              <span className="font-medium hidden sm:inline">Input Data</span>
            </div>
            <div className={`h-0.5 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-border'} transition-colors duration-500`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold border-2 ${step >= 2 ? 'bg-primary text-primary-foreground border-primary' : 'border-muted-foreground'}`}>
                2
              </div>
              <span className="font-medium hidden sm:inline">Results & Report</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {step === 1 && <Step1Input onNext={handleNext} />}
        {step === 2 && inputs && <Step2Results inputs={inputs} onBack={handleBack} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Inventory Valuation Calculator. Professional financial analysis tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;
