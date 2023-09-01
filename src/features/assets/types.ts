export interface IAssetCondition {
  id: string;
  name: "good" | "needs maintenance" | "under repair" | "damaged";
}

export interface IAssetRateInterval {
  id: string;
  name: "one time" | "daily" | "weekly" | "monthly" | "yearly";
}

export interface IAssetStatus {
  id: string;
  name: "idle" | "rented" | "not available";
}

export interface IAssetFirebaseResponse {
  condition: string;
  description: string;
  name: string;
  color: string;
  photoRef?: string;
  photoUrl: string;
  standardRateInterval: string;
  dailyRate: string;
  weeklyRate?: string;
  monthlyRate?: string;
  yearlyRate?: string;
  status: string;
  lastCustomer: string | null;
  lastRentalSchedule: string | null;
  overallProfit: number;
  createdDate: string;
  modifiedDate: string;
}
