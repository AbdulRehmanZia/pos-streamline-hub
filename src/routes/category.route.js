import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  getAllCategories
} from "../controller/category.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
const router = Router();

router.get("/all-categories", getAllCategories);
router.post("/add-category",verifyJWT, authorizeRole("ADMIN"), addCategory);
router.put("/update-category/:id",verifyJWT, authorizeRole("ADMIN"), updateCategory);
router.delete("/delete-category/:id",verifyJWT,authorizeRole("ADMIN"), deleteCategory);

export default router;
