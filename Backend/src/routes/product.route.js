import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import { addProduct, deleteProduct, getAllProducts, updateProduct } from "../controller/product/index.js";

const router = Router();

router.get("/",verifyJWT, getAllProducts);
router.post("/add-product", verifyJWT, authorizeRole("ADMIN"), addProduct);
router.put(
  "/update-product/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateProduct
);
router.delete("/delete-product/:id", verifyJWT, authorizeRole("ADMIN"), deleteProduct);

export default router;
