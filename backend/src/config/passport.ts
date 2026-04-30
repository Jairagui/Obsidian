import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "http://localhost:3000/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;

                let user = await User.findOne({ email });

                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email,
                        password: "google_auth"
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error as any, undefined);
            }
        }
    )
);