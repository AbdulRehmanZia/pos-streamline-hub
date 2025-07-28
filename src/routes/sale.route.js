import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import {
  addSale,
  deleteSale,
  getAllSales,
} from "../controller/sale.controller.js";
const router = Router();

router.get("/get-all-sales", getAllSales);
router.post("/add-sale", verifyJWT, addSale);

router.delete(
  "/delete-product/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteSale
);

export default router;
