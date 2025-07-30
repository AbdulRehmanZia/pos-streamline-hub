import { Router } from "express";

import { verifyJWT } from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";
import {
  addStoreMember,
  deleteStoreMember,
  getAllStoreMembers,
  updateStoreMember,
} from "../controller/member/index.js";

const router = Router();

router.get("/", verifyJWT, getAllStoreMembers);
router.post("/add-member", verifyJWT, authorizeRole("ADMIN"), addStoreMember);
router.put(
  "/update-member/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  updateStoreMember
);
router.delete(
  "/delete-member/:id",
  verifyJWT,
  authorizeRole("ADMIN"),
  deleteStoreMember
);

export default router;
