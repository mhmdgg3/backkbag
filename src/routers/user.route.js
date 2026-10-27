import { Router } from "express";
import * as userControllers from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.meddleware.js";
import { verifyRolle } from "../middleware/verifyRolle.meddleware.js";

const router = Router();

router.post("/", verifyToken, verifyRolle, userControllers.createUser);
router.get("/", verifyToken, verifyRolle, userControllers.users);
router.get("/:id", verifyToken, verifyRolle, userControllers.user);
router.delete("/:id", verifyToken, verifyRolle, userControllers.deleteUser);
router.patch("/:id", verifyToken, verifyRolle, userControllers.updatedUser);

export default router;
