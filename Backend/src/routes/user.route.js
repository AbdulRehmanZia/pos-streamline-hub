import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUser,
} from "../controller/user/index.js";

const router = Router();

//Public
router.post("/register", registerUser);
router.post("/login", loginUser);

//Protected
router.get("/get", verifyJWT, getUsers);
router.post("/logout", verifyJWT, logoutUser);
router.put("/update/:id", verifyJWT, updateUser);
router.delete("/delete/:id", verifyJWT, deleteUser);
router.post("/refresh-token", verifyJWT, refreshAccessToken);

export default router;
