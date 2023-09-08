import { StackNavigationProp } from "@react-navigation/stack";
import { IAssetFirebaseResponse } from "../features/assets";
import { IRentalScheduleFirebaseResponse } from "../features/scheduling/types";
import { TCustomer } from "../features/customers";

export interface IOption {
  id: string;
  name: string;
}

export interface IFunctionResponse {
  isSuccess: boolean;
  message?: string;
}

export interface ITransactionResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}

export type RootStackParamsList = {
  main: undefined;
  "asset-form":
    | {
        isEditing?: boolean;
        assetDetails?: IAssetFirebaseResponse & { id: string };
      }
    | undefined;
  "asset-details": { assetDetails: IAssetFirebaseResponse & { id: string } };
  assets: undefined;
  schedules: { updateRentalList?: boolean } | undefined;
  "rental-form":
    | {
        isEditing?: boolean;
        rentalDetails?: IRentalScheduleFirebaseResponse;
        isFromCustomer?: boolean;
        customerDetails?: TCustomer;
      }
    | undefined;
  "rental-details": { rentalDetails: IRentalScheduleFirebaseResponse };
  transactions: undefined;
  customers: undefined;
  settings: undefined;
  "update-payment-status-modal": {
    currentPaymentStatusId: string;
    rentalId: string;
    rentalStatusId: string;
    assetName: string;
    assetId: string;
  };
  "update-rental-status-modal": {
    currentRentalStatusId: string;
    rentalId: string;
    paymentStatusId: string;
    assetName: string;
    assetId: string;
  };
  "confirm-delete-modal": {
    title: string;
    confirmationMessage: string;
    onPressDelete: () => void;
  };
  "customer-modal":
    | {
        isUpdate: boolean;
        customerDetails: TCustomer;
      }
    | undefined;
  "repeat-rental-modal": { rentalDetails: IRentalScheduleFirebaseResponse };
};

export type NavigationScreensType = StackNavigationProp<RootStackParamsList>;
