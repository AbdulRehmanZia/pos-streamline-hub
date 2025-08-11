import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import { addSale, deleteSale, getSales } from "../controller/sale/index.js";

const router = Router();

router.get("/", getSales);
router.post("/add-sale", addSale);

router.delete(
  "/delete-sale/:id",
  
  //authorizeRole("admin"),
  deleteSale
);

export default router;
