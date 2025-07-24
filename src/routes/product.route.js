import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controller/product.controller.js";
const router = Router();

router.post("/all-products", verifyJWT, authorizeRole("ADMIN"), getAllProducts);
router.post("/add-product", verifyJWT, authorizeRole("ADMIN"), addProduct);
router.put(
  "/update-product/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateProduct
);
router.delete("/delete-product/:id", verifyJWT, authorizeRole(), deleteProduct);

export default router;
