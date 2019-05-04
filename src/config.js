export const {
  APP_PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  SESSION_NAME,
  SESSION_LIFE,
  SESSION_SECRET,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT
} = process.env

export const IN_PROD = NODE_ENV === 'production'
