import { Router } from "express";
import userRouter from "./user.route.js";
import storeMembersRouter from "./members.route.js";
import categoryRouter from "./category.route.js"
const router = Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/admin", storeMembersRouter);
router.use("/api/v1/admin",categoryRouter)

export default router;
