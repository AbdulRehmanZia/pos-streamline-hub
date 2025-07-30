import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controller/category/index.js";
const router = Router();

router.get("/", verifyJWT, getAllCategories);
router.post("/add-category", verifyJWT, authorizeRole("ADMIN"), addCategory);
router.put(
  "/update-category/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateCategory
);
router.delete(
  "/delete-category/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteCategory
);

export default router;
