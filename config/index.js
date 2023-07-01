import dotenv from 'dotenv'

dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    SALT,
    JWT_SECRET,
    SECRETKEYFORFOUNDER,
} = process.env