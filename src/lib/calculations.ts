import { InventoryInputs, CalculationResults, AgeReserve } from "@/types/calculator";

export const defaultAgeReserves: AgeReserve[] = [
  { minMonths: 0, maxMonths: 3, reservePercent: 0, label: "< 3 months" },
  { minMonths: 3, maxMonths: 6, reservePercent: 10, label: "3-6 months" },
  { minMonths: 6, maxMonths: 12, reservePercent: 25, label: "6-12 months" },
  { minMonths: 12, maxMonths: null, reservePercent: 50, label: "> 12 months" },
];

export function calculateInventoryValues(inputs: InventoryInputs): CalculationResults {
  // Step 1: Calculate Cost Basis
  let costBasis = inputs.originalCost;
  
  if (!inputs.costsIncluded) {
    const additionalCosts = inputs.originalCost * (
      (inputs.freightPercent / 100) +
      (inputs.laborPercent / 100) +
      (inputs.overheadPercent / 100)
    );
    costBasis = inputs.originalCost + additionalCosts;
  }

  // Step 2: Calculate Net Realizable Value (NRV)
  const netRealizableValue = inputs.currentMarketValue - inputs.costToComplete - inputs.costToSell;

  // Step 3: Calculate Age-Adjusted Value
  const reservePercent = getReservePercent(inputs.ageMonths, inputs.ageReserveTable);
  const ageAdjustedValue = costBasis * (1 - reservePercent / 100);

  // Step 4: Determine Adjusted Inventory Value based on method
  let adjustedInventoryValue: number;
  
  switch (inputs.valuationMethod) {
    case 'nrv':
      adjustedInventoryValue = Math.min(costBasis, netRealizableValue);
      break;
    case 'age':
      adjustedInventoryValue = ageAdjustedValue;
      break;
    case 'conservative':
      adjustedInventoryValue = Math.min(costBasis, netRealizableValue, ageAdjustedValue);
      break;
    default:
      adjustedInventoryValue = costBasis;
  }

  // Step 5: Calculate Write-Down
  const totalWriteDown = costBasis - adjustedInventoryValue;
  const capitalLockedPercent = (totalWriteDown / costBasis) * 100;

  // Step 6: Calculate Margin Impact
  // Assuming selling price equals current market value
  const sellingPrice = inputs.currentMarketValue;
  const originalMargin = ((sellingPrice - costBasis) / sellingPrice) * 100;
  const adjustedMargin = ((sellingPrice - adjustedInventoryValue) / sellingPrice) * 100;
  const marginImpact = adjustedMargin - originalMargin;

  return {
    costBasis,
    netRealizableValue,
    ageAdjustedValue,
    adjustedInventoryValue,
    totalWriteDown,
    capitalLockedPercent,
    marginImpact,
    originalMargin,
    adjustedMargin,
  };
}

function getReservePercent(ageMonths: number, table: AgeReserve[]): number {
  for (const reserve of table) {
    if (reserve.maxMonths === null) {
      if (ageMonths >= reserve.minMonths) {
        return reserve.reservePercent;
      }
    } else {
      if (ageMonths >= reserve.minMonths && ageMonths < reserve.maxMonths) {
        return reserve.reservePercent;
      }
    }
  }
  return 0;
}

export function formatCurrency(value: number, currency: string): string {
  const symbols: { [key: string]: string } = {
    '$': '$',
    '€': '€',
    '₹': '₹',
    '£': '£',
    '¥': '¥',
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
