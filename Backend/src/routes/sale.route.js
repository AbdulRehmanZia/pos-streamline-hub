import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import { addSale, deleteSale, getAllSales, saleSearch } from "../controller/sale/index.js";

const router = Router();

router.get("/", getAllSales);
router.get("/search",  saleSearch);
router.post("/add-sale", addSale);

router.delete(
  "/delete-sale/:id",
  
  //authorizeRole("ADMIN"),
  deleteSale
);

export default router;
