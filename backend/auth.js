const passport = require("passport");
const extractJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const localStrategy = require("passport-local").Strategy;
const { UserModel } = require("./models");
const env = require("./env");
const bcrypt = require("bcrypt");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        if (await UserModel.findOne({ email })) {
          return done(null, false, {
            message: `User with email ${email} already exists`,
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
          email,
          password: hashedPassword,
          age: req.body.age,
        });

        return done(null, {
          email: user.email,
          age: user.age,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        const validate = await user.verifyPassword(password);

        if (!validate) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, user, {
          message: "Logged in successfully",
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "jwt",
  new jwtStrategy(
    {
      secretOrKey: env.JWT_SECRET,
      jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await UserModel.findOne({
          email: token.user?.email,
        });
        return done(null, {
          email: user.email,
          age: user.age,
          twofaEnabled: user.twofaEnabled,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);
