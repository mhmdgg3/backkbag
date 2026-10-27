import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { verifyToken } from "../middleware/verifyToken.meddleware.js";
import { verifyRolle } from "../middleware/verifyRolle.meddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  verifyRolle,
  upload.single("image"),
  categoryController.createCategory,
);
router.get("/:id", categoryController.category);
router.patch(
  "/:id",
  verifyToken,
  verifyRolle,
  upload.single("image"),
  categoryController.updateCategory,
);
router.get("/", categoryController.categories);
router.delete("/:id", categoryController.deleteCategory);

export default router;
