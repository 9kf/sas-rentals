import { StackNavigationProp } from "@react-navigation/stack";
import { IAssetFirebaseResponse } from "../features/assets";

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
  schedules: undefined;
  "rental-form":
    | {
        isEditing?: boolean;
      }
    | undefined;
  transactions: undefined;
  customers: undefined;
};

export type NavigationScreensType = StackNavigationProp<RootStackParamsList>;
