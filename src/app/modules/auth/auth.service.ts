/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from "http-status";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../errorHelpers/ApiError";
import { jwtHelper } from "../../helper/jwtHelper";
import { config } from "../../config/env";
import { Secret } from "jsonwebtoken";
import { ILoginRequest, ISignupRequest } from "./auth.interface";
import { UserRole } from "@prisma/client";

const signup = async (payload: ISignupRequest) => {

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists with this email!");
  }


  const hashedPassword = await bcrypt.hash(payload.password, 12);


  const user = await prisma.user.create({
    data: {
      email: payload.email,
      passwordHash: hashedPassword,
      name: payload.name,
      role: UserRole.STUDENT, 
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
};

const login = async (payload: ILoginRequest) => {
  
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });


  if (user.status !== "ACTIVE") {
    throw new ApiError(httpStatus.FORBIDDEN, "User account is not active!");
  }

 
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.passwordHash,
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!");
  }


  const accessToken = jwtHelper.generateToken(
    { email: user.email, role: user.role, userId: user.id },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in || "1h",
  );

  const refreshToken = jwtHelper.generateToken(
    { email: user.email, role: user.role, userId: user.id },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in || "90d",
  );

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
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid refresh token!");
  }


  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  if (userData.status !== "ACTIVE") {
    throw new ApiError(httpStatus.FORBIDDEN, "User account is not active!");
  }


  const accessToken = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
      userId: userData.id,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in || "1h",
  );

  return {
    accessToken,
  };
};

const getMe = async (user: { email: string; userId: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
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
};

export const AuthService = { signup, login, refreshToken, getMe };