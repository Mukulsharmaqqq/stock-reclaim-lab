export interface InventoryInputs {
  // Basic Information
  originalCost: number;
  ageMonths: number;
  currentMarketValue: number;

  // Cost Components
  freightPercent: number;
  laborPercent: number;
  overheadPercent: number;
  costsIncluded: boolean;

  // NRV Components
  costToComplete: number;
  costToSell: number;

  // Policy
  valuationMethod: 'nrv' | 'age' | 'conservative';
  currency: string;
  ageReserveTable: AgeReserve[];
}

export interface AgeReserve {
  minMonths: number;
  maxMonths: number | null;
  reservePercent: number;
  label: string;
}

export interface CalculationResults {
  costBasis: number;
  netRealizableValue: number;
  ageAdjustedValue: number;
  adjustedInventoryValue: number;
  totalWriteDown: number;
  capitalLockedPercent: number;
  marginImpact: number;
  originalMargin: number;
  adjustedMargin: number;
}

export interface ReportData {
  fullName: string;
  email: string;
  companyName?: string;
  consent: boolean;
}
