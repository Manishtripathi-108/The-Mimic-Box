// Time constants
export const SECOND_MS = 1000;
export const MINUTE_MS = 60 * SECOND_MS;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 24 * HOUR_MS;
export const WEEK_MS = 7 * DAY_MS;
export const MONTH_MS = 30 * DAY_MS;
export const YEAR_MS = 365 * DAY_MS;

// Reusable durations
export const FIFTEEN_MINUTES_MS = 15 * MINUTE_MS;
export const ONE_HOUR_MS = HOUR_MS;
export const ONE_DAY_MS = DAY_MS;
export const THIRTY_DAYS_MS = 30 * DAY_MS;

// Auth & security
export const TOKEN_EXPIRY_MS = FIFTEEN_MINUTES_MS;
export const EMAIL_CHANGE_COOLDOWN_MS = THIRTY_DAYS_MS;
