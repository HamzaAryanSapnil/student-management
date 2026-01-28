import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    NODE_ENV: "development" | "production";
    PORT: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
}

const loadEnvVars = (): EnvConfig => {

    const requiredEnvVars : string[] = ["NODE_ENV", "PORT", "DATABASE_URL", "FRONTEND_URL"];

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    });
    
    return {
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string
    }
}

export const config = loadEnvVars();