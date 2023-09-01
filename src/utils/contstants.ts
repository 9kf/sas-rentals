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
    name: "daily",
  },
  {
    id: "2",
    name: "weekly",
  },
  {
    id: "3",
    name: "monthly",
  },
  {
    id: "4",
    name: "yearly",
  },
  // {
  //   id: "5",
  //   name: "one time",
  // },
];

export const PAYMENT_STATUS_OPTIONS = [
  {
    id: "1",
    name: "pending",
  },
  // {
  //   id: "2",
  //   name: "paid partially",
  // },
  {
    id: "3",
    name: "paid",
  },
];

export const RENTAL_STATUS_OPTIONS = [
  {
    id: "1",
    name: "not delivered",
  },
  {
    id: "2",
    name: "delivered",
  },
  {
    id: "3",
    name: "returned",
  },
];

export const IMAGE_PLACEHOLDER = "https://cdn2.thecatapi.com/images/6tv.jpg";

export const DEFAULT_SUCCESS_MESSAGES = {
  ADD_SUCCESS: "Successfully added",
  DELETE_SUCCESS: "Successfully deleted",
};

export const DEFAULT_ERROR_MESSAGES = {
  ADD_ERROR: "There was a problem adding",
  DELETE_ERROR: "There was a problem deleting",
};
