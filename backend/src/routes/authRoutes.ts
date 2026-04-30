import { Router } from "express";
import passport from "passport";

import { register, login, getMe, logout } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import { generateToken } from "../utils/generateToken";

const router = Router();

// Auth básica
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);

// Google Auth - iniciar
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth - callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req: any, res) => {
        const token = generateToken(req.user);

        res.json({
            msg: "Login con Google exitoso",
            token,
            user: req.user
        });
    }
);

export default router;