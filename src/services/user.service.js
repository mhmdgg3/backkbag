import * as userRepo from "../repo/user.repo.js";
import bcrypt from "bcrypt";

export const createUser = async (firstName, lastName, email, password) => {
  const findUser = await userRepo.findByEmail(email);
  if (findUser) {
    const error = new Error("email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser(
    firstName,
    lastName,
    email,
    hashPassword,
  );

  return user;
};

export const updatedUser = async (id, firstName, lastName, email, password) => {
  let hashPassword;
  if (typeof password === "string" && password.trim() !== "") {
    hashPassword = await bcrypt.hash(password, 10);
  }

  const user = await userRepo.updatedUser(
    id,
    firstName,
    lastName,
    email,
    hashPassword,
  );
  return user;
};
