import { Router } from "express";
import { register, login } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import { getMe } from "../controllers/authController";
import { logout } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);


export default router;