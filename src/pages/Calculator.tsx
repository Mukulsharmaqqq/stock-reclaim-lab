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
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${step >= 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
              <span className="font-semibold text-sm">Input Data</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className={`h-0.5 flex-1 ${step >= 2 ? 'bg-primary' : 'bg-border'} transition-all duration-500`} />
              <svg 
                className={`w-4 h-4 transition-all duration-500 ${step >= 2 ? 'text-primary translate-x-1' : 'text-muted-foreground'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${step >= 2 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
              <span className="font-semibold text-sm">Results & Report</span>
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
