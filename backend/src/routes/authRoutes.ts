import { Router } from "express";
import passport from "passport";

import { register, login, getMe, logout, borrarCuenta } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import { generateToken } from "../utils/generateToken";

const router = Router();

// Auth básica
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);
router.delete("/mi-cuenta", verifyToken, borrarCuenta);

// Google Auth iniciar
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth - callback google nos regresa aqui
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req: any, res) => {
        const token = generateToken(req.user);
        const frontUrl = process.env.FRONTEND_URL || "http://localhost:5173";

        // redirigimos al frontend con el token en la url
        res.redirect(
            `${frontUrl}/auth/google/callback?token=${token}&name=${req.user.name}&role=${req.user.role}&id=${req.user._id}`
        );
    }
);

export default router;
