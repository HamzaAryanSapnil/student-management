import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    NODE_ENV: "development" | "production";
    PORT: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
    jwt: {
        jwt_secret: string | undefined;
        expires_in: string | undefined;
        refresh_token_secret: string | undefined;
        refresh_token_expires_in: string | undefined;
        reset_pass_secret: string | undefined;
        reset_pass_token_expires_in: string | undefined;
    };
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
      FRONTEND_URL: process.env.FRONTEND_URL as string,
      jwt: {
        jwt_secret: process.env.JWT_SECRET,
        expires_in: process.env.EXPIRES_IN,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
        reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
      },
    };
}

export const config = loadEnvVars();