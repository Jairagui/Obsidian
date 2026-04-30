import { Router } from "express";
import { register, login } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";
import { getMe } from "../controllers/authController";
import { logout } from "../controllers/authController";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.post("/logout", logout);
// iniciar login con Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        res.send("Login con Google exitoso");
    }
);


export default router;