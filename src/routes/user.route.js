import { Router } from "express";
import {
  registerUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controller/user.controller.js";

const router = Router();

router.get("/get", getUser);
router.post("/register", registerUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
