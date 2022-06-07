const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { authenticator } = require("otplib");
const env = require("./env");
const { UserModel } = require("./models.js");

const signup = async (req, res) => {
  return res.status(201).json({
    message: "Signup successful",
    user: req.user,
  });
};

const login = async (req, res, next) => {
  passport.authenticate(
    "login",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      if (!user.twofaEnabled) {
        return res.json({
          message: "Login successful",
          twofaEnabled: false,
          token: jwt.sign(
            {
              user: { email: user.email },
            },
            env.JWT_SECRET
          ),
        });
      } else {
        return res.json({
          message: "Please complete 2-factor authentication",
          twofaEnabled: true,
          loginStep2VerificationToken: jwt.sign(
            {
              // important to keep this payload different from a real/proper
              // authentication token payload so that this token cannot be used
              // for real/proper authentication defeating the whole point of
              // 2-factor authentication
              loginStep2Verification: { email: user.email },
            },
            env.JWT_SECRET,
            { expiresIn: "5m" }
          ),
        });
      }
    }
  )(req, res, next);
};

const loginStep2 = async (req, res) => {
  let loginStep2VerificationToken = null;
  try {
    loginStep2VerificationToken = jwt.verify(
      req.body.loginStep2VerificationToken,
      env.JWT_SECRET
    );
  } catch (err) {
    return res.status(401).json({
      message: "You are not authorized to perform login step-2",
    });
  }

  const token = req.body.twofaToken.replaceAll(" ", "");
  const user = await UserModel.findOne({
    email: loginStep2VerificationToken.loginStep2Verification.email,
  });
  if (!authenticator.check(token, user.twofaSecret)) {
    return res.status(400).json({
      message: "OTP verification failed: Invalid token",
    });
  } else {
    return res.json({
      message: "OTP verification successful",
      token: jwt.sign(
        {
          user: { email: user.email },
        },
        env.JWT_SECRET
      ),
    });
  }
};

const profile = async (req, res) => {
  return res.json({
    message: "Success",
    user: req.user,
  });
};

const generate2faSecret = async (req, res) => {
  const user = await UserModel.findOne({ email: req.user.email });

  if (user.twofaEnabled) {
    return res.status(400).json({
      message: "2FA already verified and enabled",
      twofaEnabled: user.twofaEnabled,
    });
  }

  const secret = authenticator.generateSecret();
  user.twofaSecret = secret;
  user.save();
  const appName = "Express 2FA Demo";

  return res.json({
    message: "2FA secret generation successful",
    secret: secret,
    qrImageDataUrl: await qrcode.toDataURL(
      authenticator.keyuri(req.user.email, appName, secret)
    ),
    twofaEnabled: user.twofaEnabled,
  });
};

const verifyOtp = async (req, res) => {
  const user = await UserModel.findOne({ email: req.user.email });
  if (user.twofaEnabled) {
    return res.json({
      message: "2FA already verified and enabled",
      twofaEnabled: user.twofaEnabled,
    });
  }

  const token = req.body.token.replaceAll(" ", "");
  if (!authenticator.check(token, user.twofaSecret)) {
    return res.status(400).json({
      message: "OTP verification failed: Invalid token",
      twofaEnabled: user.twofaEnabled,
    });
  } else {
    user.twofaEnabled = true;
    user.save();

    return res.json({
      message: "OTP verification successful",
      twofaEnabled: user.twofaEnabled,
    });
  }
};

const disable2fa = async (req, res) => {
  const user = await UserModel.findOne({ email: req.user.email });
  user.twofaEnabled = false;
  user.twofaSecret = "";
  await user.save();

  return res.json({
    message: "2FA disabled successfully",
    twofaEnabled: user.twofaEnabled,
  });
};

const catchAll = async (req, res) => {
  return res.status(404).json({
    message: `An error occurred or ${req.originalUrl} not found`,
  });
};

module.exports = {
  signup,
  login,
  loginStep2,
  profile,
  generate2faSecret,
  verifyOtp,
  disable2fa,
  catchAll,
};
