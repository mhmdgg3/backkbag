import * as authController from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", authController.login);
router.post("/register", createUser);
router.post("/refresh", authController.refresh);

export default router;
