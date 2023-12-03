const z = require("zod");

const path = require("path");
const APP_ENV = process.env.APP_ENV ?? "development";
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);

require("dotenv").config({
  path: envPath,
});

// creating the schema
const client = z.object({
  APP_ENV: z.enum(["development", "staging", "production"]),
  ASSETS_FIRESTORE: z.string(),
  CUSTOMERS_FIRESTORE: z.string(),
  RENTAL_SCHEDULE_FIRESTORE: z.string(),
});

const buildTime = z.object({
  ASSETS_FIRESTORE: z.string(),
  CUSTOMERS_FIRESTORE: z.string(),
  RENTAL_SCHEDULE_FIRESTORE: z.string(),
});

// Get the environment from the process

/**
 * @type {Record<keyof z.infer<typeof client> , string | undefined>}
 */
const _clientEnv = {
  APP_ENV,

  // ADD YOUR ENV VARS HERE TOO
  ASSETS_FIRESTORE: process.env.ASSETS_FIRESTORE,
  CUSTOMERS_FIRESTORE: process.env.CUSTOMERS_FIRESTORE,
  RENTAL_SCHEDULE_FIRESTORE: process.env.RENTAL_SCHEDULE_FIRESTORE,
};

/**
 * @type {Record<keyof z.infer<typeof buildTime> , string | undefined>}
 */
const _buildTimeEnv = {
  // ADD YOUR ENV VARS HERE TOO
  ASSETS_FIRESTORE: process.env.ASSETS_FIRESTORE,
  CUSTOMERS_FIRESTORE: process.env.CUSTOMERS_FIRESTORE,
  RENTAL_SCHEDULE_FIRESTORE: process.env.RENTAL_SCHEDULE_FIRESTORE,
};

const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,

    `\n❌ Missing variables in .env.${APP_ENV} file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -cc flag to clear the cache.`
  );
  throw new Error(
    "Invalid environment variables, Check terminal for more details "
  );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = {
  Env,
  ClientEnv,
};
