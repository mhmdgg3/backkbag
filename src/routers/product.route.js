import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/verifyToken.meddleware.js";
import { verifyRolle } from "../middleware/verifyRolle.meddleware.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post(
  "/",
//   verifyToken,
//   verifyRolle,
  upload.array("images", 10),
  productController.createProduct,
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.delete("/:id", verifyToken,verifyRolle, productController.deleteProduct);
router.patch(
  "/:id",
  verifyToken,
  verifyRolle,
  upload.array("images", 10),
  productController.updateProduct,
);

export default router;
