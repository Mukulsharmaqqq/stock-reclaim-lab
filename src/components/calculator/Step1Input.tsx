import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryInputs, AgeReserve } from "@/types/calculator";
import { defaultAgeReserves } from "@/lib/calculations";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LivePreview } from "./LivePreview";

interface Step1InputProps {
  onNext: (inputs: InventoryInputs) => void;
}

const ageButtons = [
  { label: "< 3", value: 2 },
  { label: "3-6", value: 4.5 },
  { label: "6-12", value: 9 },
  { label: "> 12", value: 15 },
];

export function Step1Input({ onNext }: Step1InputProps) {
  const [inputs, setInputs] = useState<InventoryInputs>({
    originalCost: 0,
    ageMonths: 0,
    currentMarketValue: 0,
    freightPercent: 0,
    laborPercent: 0,
    overheadPercent: 0,
    costsIncluded: false,
    costToComplete: 0,
    costToSell: 0,
    valuationMethod: 'conservative',
    currency: '$',
    ageReserveTable: defaultAgeReserves,
  });

  const updateInput = (field: keyof InventoryInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!inputs.originalCost || inputs.originalCost <= 0) {
      return;
    }
    if (inputs.currentMarketValue < 0) {
      return;
    }
    if (!inputs.ageMonths || inputs.ageMonths <= 0) {
      return;
    }
    onNext(inputs);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-5"
      >
        {/* Basic Information */}
        <Card className="p-5 border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">
            Basic Information
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            This calculator is for a specific product line, batch, or item, not your entire inventory. Run it per category or item if needed.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalCost" className="flex items-center gap-1.5 text-sm">
                Original Cost
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Total cost when this stock was made or bought</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{inputs.currency}</span>
                <Input
                  id="originalCost"
                  type="number"
                  value={inputs.originalCost || ''}
                  onChange={(e) => updateInput('originalCost', parseFloat(e.target.value) || 0)}
                  placeholder="12000"
                  className="pl-7 h-9"
                  required
                  min="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMarketValue" className="flex items-center gap-1.5 text-sm">
                Market Value
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">What you could realistically sell it for now</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{inputs.currency}</span>
                <Input
                  id="currentMarketValue"
                  type="number"
                  value={inputs.currentMarketValue || ''}
                  onChange={(e) => updateInput('currentMarketValue', parseFloat(e.target.value) || 0)}
                  placeholder="9000"
                  className="pl-7 h-9"
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Age (months)</Label>
              <div className="flex gap-1.5">
                {ageButtons.map((btn) => (
                  <Button
                    key={btn.value}
                    type="button"
                    size="sm"
                    variant={inputs.ageMonths === btn.value ? "default" : "outline"}
                    onClick={() => updateInput('ageMonths', btn.value)}
                    className="flex-1 h-9 text-xs"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Cost Components & NRV */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Cost Components */}
          <Card className="p-5 border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Cost Components
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <Label htmlFor="costsIncluded" className="cursor-pointer text-sm">
                  Already included in original cost?
                </Label>
                <Switch
                  id="costsIncluded"
                  checked={inputs.costsIncluded}
                  onCheckedChange={(checked) => updateInput('costsIncluded', checked)}
                />
              </div>

              <div className={`space-y-4 transition-opacity ${inputs.costsIncluded ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Freight-in %</Label>
                    <span className="text-xs font-medium text-primary">{inputs.freightPercent}%</span>
                  </div>
                  <Slider
                    value={[inputs.freightPercent]}
                    onValueChange={([value]) => updateInput('freightPercent', value)}
                    max={100}
                    step={1}
                    disabled={inputs.costsIncluded}
                    className="py-1"
                  />
                  <p className="text-xs text-muted-foreground">Transport or import cost as a % of original cost</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Labor %</Label>
                    <span className="text-xs font-medium text-primary">{inputs.laborPercent}%</span>
                  </div>
                  <Slider
                    value={[inputs.laborPercent]}
                    onValueChange={([value]) => updateInput('laborPercent', value)}
                    max={100}
                    step={1}
                    disabled={inputs.costsIncluded}
                    className="py-1"
                  />
                  <p className="text-xs text-muted-foreground">Direct labor cost as a % of original cost</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Overhead %</Label>
                    <span className="text-xs font-medium text-primary">{inputs.overheadPercent}%</span>
                  </div>
                  <Slider
                    value={[inputs.overheadPercent]}
                    onValueChange={([value]) => updateInput('overheadPercent', value)}
                    max={100}
                    step={1}
                    disabled={inputs.costsIncluded}
                    className="py-1"
                  />
                  <p className="text-xs text-muted-foreground">Factory rent, power, admin, etc., as a % of original cost</p>
                </div>

                <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
                  If these are already included in your original cost, set them to 0% or toggle "Already included" to Yes.
                </p>
              </div>
            </div>
          </Card>

          {/* NRV Components */}
          <Card className="p-5 border-border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Resale Costs
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="costToComplete" className="flex items-center gap-1.5 text-sm">
                  Cost to Complete
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48">Additional cost to finish items if work in progress</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{inputs.currency}</span>
                  <Input
                    id="costToComplete"
                    type="number"
                    value={inputs.costToComplete || ''}
                    onChange={(e) => updateInput('costToComplete', parseFloat(e.target.value) || 0)}
                    placeholder="1000"
                    className="pl-7 h-9"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="costToSell" className="flex items-center gap-1.5 text-sm">
                  Cost to Sell
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-48">Freight-out, packaging, commission, or disposal cost</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">{inputs.currency}</span>
                  <Input
                    id="costToSell"
                    type="number"
                    value={inputs.costToSell || ''}
                    onChange={(e) => updateInput('costToSell', parseFloat(e.target.value) || 0)}
                    placeholder="500"
                    className="pl-7 h-9"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Currency Selection */}
        <Card className="p-5 border-border shadow-sm">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Currency</Label>
            <Select value={inputs.currency} onValueChange={(value) => updateInput('currency', value)}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$ USD</SelectItem>
                <SelectItem value="€">€ EUR</SelectItem>
                <SelectItem value="£">£ GBP</SelectItem>
                <SelectItem value="₹">₹ INR</SelectItem>
                <SelectItem value="¥">¥ JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={handleSubmit} 
            size="lg" 
            className="w-full group"
            disabled={!inputs.originalCost || inputs.originalCost <= 0 || inputs.currentMarketValue < 0 || !inputs.ageMonths || inputs.ageMonths <= 0}
          >
            Find Inventory Valuation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>

      <div className="hidden lg:block">
        <LivePreview inputs={inputs} />
      </div>
    </div>
  );
}
