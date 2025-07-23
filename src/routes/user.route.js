import { Router } from "express";
import {
  registerUser,
  deleteUser,
  getUsers,
  updateUser,
  loginUser,
  logoutUser,
  refreshAccessToken
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/get", getUsers);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/register", registerUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.post("/refresh-token", refreshAccessToken)

export default router;
