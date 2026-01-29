"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../shared/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ApiError_1 = __importDefault(require("../../errorHelpers/ApiError"));
const jwtHelper_1 = require("../../helper/jwtHelper");
const env_1 = require("../../config/env");
const client_1 = require("@prisma/client");
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists with this email!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.password, 12);
    const user = yield prisma_1.prisma.user.create({
        data: {
            email: payload.email,
            passwordHash: hashedPassword,
            name: payload.name,
            role: client_1.UserRole.STUDENT,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isVerified: true,
            status: true,
            createdAt: true,
        },
    });
    return user;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    if (user.status !== "ACTIVE") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User account is not active!");
    }
    const isCorrectPassword = yield bcryptjs_1.default.compare(payload.password, user.passwordHash);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    const accessToken = jwtHelper_1.jwtHelper.generateToken({ email: user.email, role: user.role, userId: user.id }, env_1.config.jwt.jwt_secret, env_1.config.jwt.expires_in || "1h");
    const refreshToken = jwtHelper_1.jwtHelper.generateToken({ email: user.email, role: user.role, userId: user.id }, env_1.config.jwt.refresh_token_secret, env_1.config.jwt.refresh_token_expires_in || "90d");
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
            status: user.status,
        },
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelper.verifyToken(token, env_1.config.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token!");
    }
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        },
    });
    if (userData.status !== "ACTIVE") {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "User account is not active!");
    }
    const accessToken = jwtHelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role,
        userId: userData.id,
    }, env_1.config.jwt.jwt_secret, env_1.config.jwt.expires_in || "1h");
    return {
        accessToken,
    };
});
const getMe = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
        select: {
            id: true,
            email: true,
            name: true,
            profileImage: true,
            bio: true,
            location: true,
            isVerified: true,
            status: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return userData;
});
exports.AuthService = { signup, login, refreshToken, getMe };
