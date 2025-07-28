import { Router } from "express";
import userRouter from "./user.route.js";
import storeMembersRouter from "./members.route.js";
import categoryRouter from "./category.route.js";
import productRouter from "./product.route.js";
import saleRouter from "./sale.route.js";
const router = Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/admin/members", storeMembersRouter);
router.use("/api/v1/admin/categories", categoryRouter);
router.use("/api/v1/admin/sales", saleRouter);
router.use("/api/v1/admin/products", productRouter);

export default router;
