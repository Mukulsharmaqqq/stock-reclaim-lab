import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    originalCost: 12000,
    ageMonths: 8,
    currentMarketValue: 9000,
    freightPercent: 10,
    laborPercent: 25,
    overheadPercent: 15,
    costsIncluded: false,
    costToComplete: 1000,
    costToSell: 500,
    valuationMethod: 'conservative',
    currency: '$',
    ageReserveTable: defaultAgeReserves,
  });

  const updateInput = (field: keyof InventoryInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onNext(inputs);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</span>
            Basic Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originalCost" className="flex items-center gap-2">
                Original Cost
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Total cost when this stock was made or bought</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{inputs.currency}</span>
                <Input
                  id="originalCost"
                  type="number"
                  value={inputs.originalCost}
                  onChange={(e) => updateInput('originalCost', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMarketValue" className="flex items-center gap-2">
                Current Market Value
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">What you could realistically sell it for now</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{inputs.currency}</span>
                <Input
                  id="currentMarketValue"
                  type="number"
                  value={inputs.currentMarketValue}
                  onChange={(e) => updateInput('currentMarketValue', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Age of Stock (months)</Label>
              <div className="flex gap-2">
                {ageButtons.map((btn) => (
                  <Button
                    key={btn.value}
                    type="button"
                    variant={Math.abs(inputs.ageMonths - btn.value) < 2 ? "default" : "outline"}
                    onClick={() => updateInput('ageMonths', btn.value)}
                    className="flex-1"
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                value={inputs.ageMonths}
                onChange={(e) => updateInput('ageMonths', parseFloat(e.target.value) || 0)}
                className="mt-2"
                min="0"
              />
            </div>
          </div>
        </Card>

        {/* Cost Components */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</span>
            Cost Components
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <Label htmlFor="costsIncluded" className="cursor-pointer">
                Already included in cost?
              </Label>
              <Switch
                id="costsIncluded"
                checked={inputs.costsIncluded}
                onCheckedChange={(checked) => updateInput('costsIncluded', checked)}
              />
            </div>

            <div className={`space-y-6 transition-opacity ${inputs.costsIncluded ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Freight-in %</Label>
                  <span className="text-sm font-medium text-primary">{inputs.freightPercent}%</span>
                </div>
                <Slider
                  value={[inputs.freightPercent]}
                  onValueChange={([value]) => updateInput('freightPercent', value)}
                  max={100}
                  step={1}
                  disabled={inputs.costsIncluded}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Labor %</Label>
                  <span className="text-sm font-medium text-primary">{inputs.laborPercent}%</span>
                </div>
                <Slider
                  value={[inputs.laborPercent]}
                  onValueChange={([value]) => updateInput('laborPercent', value)}
                  max={100}
                  step={1}
                  disabled={inputs.costsIncluded}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Overhead %</Label>
                  <span className="text-sm font-medium text-primary">{inputs.overheadPercent}%</span>
                </div>
                <Slider
                  value={[inputs.overheadPercent]}
                  onValueChange={([value]) => updateInput('overheadPercent', value)}
                  max={100}
                  step={1}
                  disabled={inputs.costsIncluded}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* NRV Components */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</span>
            NRV (Resale) Components
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="costToComplete" className="flex items-center gap-2">
                Cost to Complete
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Additional cost to finish items if work in progress</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{inputs.currency}</span>
                <Input
                  id="costToComplete"
                  type="number"
                  value={inputs.costToComplete}
                  onChange={(e) => updateInput('costToComplete', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="costToSell" className="flex items-center gap-2">
                Cost to Sell
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Freight-out, packaging, commission, or disposal cost</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{inputs.currency}</span>
                <Input
                  id="costToSell"
                  type="number"
                  value={inputs.costToSell}
                  onChange={(e) => updateInput('costToSell', parseFloat(e.target.value) || 0)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Policy Choice */}
        <Card className="p-6 border-border shadow-sm">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</span>
            Valuation Policy
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Valuation Method</Label>
              <RadioGroup value={inputs.valuationMethod} onValueChange={(value: any) => updateInput('valuationMethod', value)}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="nrv" id="nrv" />
                  <Label htmlFor="nrv" className="flex-1 cursor-pointer">
                    <div className="font-medium">NRV Only</div>
                    <div className="text-sm text-muted-foreground">Net Realizable Value method</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="age" id="age" />
                  <Label htmlFor="age" className="flex-1 cursor-pointer">
                    <div className="font-medium">Age-Based Only</div>
                    <div className="text-sm text-muted-foreground">Time-based depreciation</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="conservative" id="conservative" />
                  <Label htmlFor="conservative" className="flex-1 cursor-pointer">
                    <div className="font-medium">Conservative - Both</div>
                    <div className="text-sm text-muted-foreground">Uses lower of NRV and age-based</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Currency</Label>
              <Select value={inputs.currency} onValueChange={(value) => updateInput('currency', value)}>
                <SelectTrigger>
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
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={handleSubmit} size="lg" className="w-full group">
            Generate Results
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
