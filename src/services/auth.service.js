
import * as authRepo from "../repo/auth.repo.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.model.js";
import { genrateAccessToken } from "../utils/generateToken.js";

export const login = async (email, password) => {
  const user = await authRepo.findUserByEmail(email);

  if (!user) {
    return;
  }

  const comparePassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!comparePassword) {
    return;
  }

  return user;
};

export const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh Token Missing");
    error.status = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );
  } catch {
    const error = new Error("Invalid or expired refresh token");
    error.status = 401;
    throw error;
  }

  if (decoded.type !== "refresh") {
    const error = new Error("Invalid token type");
    error.status = 401;
    throw error;
  }

  if (!decoded.userId) {
    const error = new Error("Invalid token payload");
    error.status = 401;
    throw error;
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    const error = new Error("User not found");
    error.status = 401;
    throw error;
  }

  const accessToken = genrateAccessToken(user);

  return accessToken;
};
