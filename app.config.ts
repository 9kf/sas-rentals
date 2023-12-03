import type { ConfigContext, ExpoConfig } from "@expo/config";

import { ClientEnv, Env } from "./env";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "sas-rentals",
  slug: "sas-rentals",
  // ... the rest config
  //   ios: {
  //     bundleIdentifier: Env.BUNDLE_ID,
  //   },
  extra: {
    ...ClientEnv,
    eas: {
      projectId: "8f7ff09f-de8d-43d1-83f1-6c1f79d8e93a",
    },
  },
  owner: "vagusinc",
  updates: {
    url: "https://u.expo.dev/8f7ff09f-de8d-43d1-83f1-6c1f79d8e93a",
  },
  runtimeVersion: "1.0.0",
  // android: {
  //   package: "com.vagus.sasrentals.android",
  //   googleServicesFile: process.env.GOOGLE_SERVICES_BASE64,
  // },
  // ios: {
  //   googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
  // },
  // .. sentry config and other stuff here
});
