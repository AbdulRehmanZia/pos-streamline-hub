import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import { addSale, deleteSale, getAllSales, saleSearch } from "../controller/sale/index.js";

const router = Router();

router.get("/", verifyJWT, getAllSales);
router.get("/search", verifyJWT, saleSearch);
router.post("/add-sale", verifyJWT, addSale);

router.delete(
  "/delete-product/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteSale
);

export default router;
