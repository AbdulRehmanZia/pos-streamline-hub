import express from "express";
import { AllAnalyst } from "../controller/Analyst/get/index.js";
import { verifyJWT } from "../middleware/authMiddleware.js";


const router = express.Router();


router.get("/",verifyJWT, AllAnalyst);


export default router