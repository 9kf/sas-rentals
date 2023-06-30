import { Double } from "react-native/Libraries/Types/CodegenTypes";

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

export interface IAsset {
  name: string;
  description: string;
  photo?: string;
  condition?: IAssetCondition;
  status?: IAssetStatus;
  standardRate: number;
  rateInterval?: IAssetRateInterval;
  color?: string;
  lastRentalSchedule?: string | null;
  lastCustomer?: string | null;
  overallProfit?: Double;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IAssetFirebaseResponse {
  condition: string;
  description: string;
  name: string;
  photoRef?: string;
  photoUrl: string;
  rateInterval: string;
  standardRate: string;
  status: string;
  lastCustomer: string | null;
  lastRentalSchedule: string | null;
  overallProfit: number;
  createdDate: string;
  modifiedDate: string;
}
