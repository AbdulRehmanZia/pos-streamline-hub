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

//Public
router.post("/register", registerUser);
router.post("/login", loginUser);

//Protected
router.get("/get", verifyJWT, getUsers);
router.post("/logout", verifyJWT, logoutUser);
router.put("/update/:id",verifyJWT, updateUser);
router.delete("/delete/:id",verifyJWT, deleteUser);
router.post("/refresh-token",verifyJWT, refreshAccessToken)

export default router;
