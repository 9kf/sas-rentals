import {
  IAssetCondition,
  IAssetRateInterval,
  IAssetStatus,
} from "../features/assets";

export const ASSET_STATUSES: IAssetStatus[] = [
  {
    id: "1",
    name: "idle",
  },
  {
    id: "2",
    name: "rented",
  },
  {
    id: "3",
    name: "not available",
  },
];

export const CONDITION_OPTIONS: IAssetCondition[] = [
  {
    id: "1",
    name: "good",
  },
  {
    id: "2",
    name: "needs maintenance",
  },
  {
    id: "3",
    name: "under repair",
  },
  {
    id: "4",
    name: "damaged",
  },
];

export const RATE_INTERVAL_OPTIONS: IAssetRateInterval[] = [
  {
    id: "1",
    name: "one time",
  },
  {
    id: "2",
    name: "daily",
  },
  {
    id: "3",
    name: "weekly",
  },
  {
    id: "4",
    name: "monthly",
  },
  {
    id: "5",
    name: "yearly",
  },
];

export const DEFAULT_SUCCESS_MESSAGES = {
  ADD_SUCCESS: "Successfully added",
  DELETE_SUCCESS: "Successfully deleted",
};

export const DEFAULT_ERROR_MESSAGES = {
  ADD_ERROR: "There was a problem adding",
  DELETE_ERROR: "There was a problem deleting",
};

export const DOCUMENTS = {
  assets: "ASSETS",
};
