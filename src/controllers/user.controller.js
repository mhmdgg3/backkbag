import * as userRepo from "../repo/user.repo.js";
import * as userServices from "../services/user.service.js";

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password , confirmPassword } = req.body;

  try {
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() 
    ) {
      return res.status(400).json({
        success: false,
        message: "user validation failed",
      });
    }
    const user = await userServices.createUser(
      firstName,
      lastName,
      email,
      password,
    );

    res.status(201).json({
      success: true,
      message: "created successful",
      user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "internal server error",
    });
  }
};

export const users = async (req, res) => {
  try {
    const users = await userRepo.users();

    if (!users.length) {
      res.status(401).json({
        success: false,
        message: "users not found",
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const user = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userRepo.user(id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userRepo.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "deleted successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatedUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { id } = req.params;

  try {
    const user = await userServices.updatedUser(
      id,
      firstName,
      lastName,
      email,
      password,
    );

    res.status(202).json({
      success: true,
      message: "seccess update",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
