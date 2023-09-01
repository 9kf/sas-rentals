import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { ListKeyValueSchemaType } from "../../components/list-key-value/useListKeyValue";
import {
  PAYMENT_STATUS_OPTIONS,
  RENTAL_STATUS_OPTIONS,
} from "../../utils/contstants";
import { TCustomer } from "../customers";

export interface WeekData {
  startDate: string;
  endDate: string;
}

export interface MonthData {
  [week: string]: WeekData;
}

export interface DateRanges {
  [month: string]: MonthData;
}

export interface IRentalScheduleFirebaseResponse {
  id?: string;
  asset: {
    id: string;
    name: string;
    color: string;
  };
  startDate: FirebaseFirestoreTypes.Timestamp;
  endDate: FirebaseFirestoreTypes.Timestamp;
  customer: Omit<TCustomer, "address">;
  address: string;
  dailyRate: number;
  rate: number;
  rateInterval: string;
  mobilizationFee: number;
  safetyDeposit: number;
  expenses: ListKeyValueSchemaType[];
  comments: string;
  paymentStatus: (typeof PAYMENT_STATUS_OPTIONS)[0];
  rentalStatus: (typeof RENTAL_STATUS_OPTIONS)[0];
  createdDate: FirebaseFirestoreTypes.Timestamp;
  modifiedDate: FirebaseFirestoreTypes.Timestamp;
  expectedPayment: number;
  netProfit: number;
  includeSundays: boolean;
}
