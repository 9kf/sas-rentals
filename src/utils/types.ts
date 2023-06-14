import { StackNavigationProp } from "@react-navigation/stack";
import { IAsset } from "../features/assets";

export interface IOption {
  id: string;
  name: string;
}

export interface IFunctionResponse {
  isSuccess: boolean;
  message?: string;
}

export type RootStackParamsList = {
  main: undefined;
  "asset-form": { isEditing?: boolean; assetDetails?: IAsset } | undefined;
  "asset-details": { assetDetails: IAsset };
  assets: undefined;
  schedules: undefined;
  transactions: undefined;
  customers: undefined;
};

export type NavigationScreensType = StackNavigationProp<RootStackParamsList>;
