import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "https://obsidian-production-8ce3.up.railway.app/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;

                // buscar por googleId o por correo
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email }]
                });

                if (!user) {
                    // crear usuario nuevo sin password, usa google
                    user = new User({
                        name: profile.displayName,
                        email,
                        googleId: profile.id,
                        role: "user"
                    });
                    await user.save();
                } else if (!user.googleId) {
                    // si ya tenia cuenta normal, le pegamos el googleId
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error as any, undefined);
            }
        }
    )
);
