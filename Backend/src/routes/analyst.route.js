import express from "express";
import { AllAnalyst, RecentActivity } from "../controller/Analyst/get/index.js";
import { verifyJWT } from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/",verifyJWT, AllAnalyst);
router.get("/recent-activity",verifyJWT, RecentActivity);


export default router