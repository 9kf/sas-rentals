import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import { IAsset } from "./types";
import { AssetFormSchemaType } from "./hooks/useAssetForm";
import {
  CONDITION_OPTIONS,
  DEFAULT_ERROR_MESSAGES,
  DEFAULT_SUCCESS_MESSAGES,
  RATE_INTERVAL_OPTIONS,
} from "../../utils/contstants";
import { ASSET_STATUSES } from "../../utils/contstants";
import { IFunctionResponse } from "../../utils/types";

export const defaultAssetState: Partial<IAssetState> = {
  assets: [],
};

export interface IAssetState {
  assets: IAsset[];
  addAsset: (data: Required<AssetFormSchemaType>) => IFunctionResponse;
  deleteAsset: (assetName: string) => IFunctionResponse;
}

export const useAssetStore = create<IAssetState>()(
  devtools(
    persist(
      (set, get) => ({
        assets: [],
        addAsset(data) {
          const currentAssetList = get().assets;

          if (currentAssetList.find((asset) => asset.name === data.name)) {
            return {
              isSuccess: false,
              message: `${DEFAULT_ERROR_MESSAGES.ADD_ERROR} ${data.name}`,
            };
          }

          const assetCondition = CONDITION_OPTIONS.find(
            (option) => option.id === data.condition
          );
          const assetRateInterval = RATE_INTERVAL_OPTIONS.find(
            (option) => option.id === data.rateInterval
          );

          const newAsset: IAsset = {
            ...data,
            condition: assetCondition,
            rateInterval: assetRateInterval,
            standardRate: parseFloat(data.standardRate),
            status: ASSET_STATUSES[0],
            lastCustomer: null,
            lastRentalSchedule: null,
            overallProfit: 0,
            createdDate: new Date().toLocaleDateString(),
            modifiedDate: new Date().toLocaleDateString(),
          };

          set(() => ({ assets: [...currentAssetList, newAsset] }));

          return {
            isSuccess: true,
            message: `${DEFAULT_SUCCESS_MESSAGES.ADD_SUCCESS} ${newAsset.name}`,
          };
        },
        deleteAsset(assetName) {
          const currentAssetList = get().assets;

          if (!currentAssetList.find((asset) => asset.name === assetName)) {
            return {
              isSuccess: false,
              message: `${DEFAULT_ERROR_MESSAGES.DELETE_ERROR} ${assetName}`,
            };
          }

          const newAssetList = currentAssetList.filter(
            (asset) => asset.name !== assetName
          );

          set(() => ({ assets: [...newAssetList] }));

          return {
            isSuccess: true,
            message: `${DEFAULT_SUCCESS_MESSAGES.DELETE_SUCCESS} ${assetName}`,
          };
        },
      }),
      {
        name: "asset-storage",
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);
