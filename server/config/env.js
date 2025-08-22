import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || "development"}.local`});

export const {
    PORT,
    NODE_ENV,
    DB_PASSWORD ,
    DB_USERNAME ,
    DB_HOST,
    DB_NAME,
    DB_PORT,
} = process.env;

