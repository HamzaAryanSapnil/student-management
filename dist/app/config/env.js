"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVars = () => {
    const requiredEnvVars = ["NODE_ENV", "PORT", "DATABASE_URL", "FRONTEND_URL"];
    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing environment variable: ${envVar}`);
        }
    });
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        jwt: {
            jwt_secret: process.env.JWT_SECRET,
            expires_in: process.env.EXPIRES_IN,
            refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
            refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
            reset_pass_secret: process.env.RESET_PASS_TOKEN,
            reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
        },
    };
};
exports.config = loadEnvVars();
