import bcrypt from "bcrypt";
import db from "../models/index.js";
import { generateRefreshToken, generateToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const { User, Role, UserAuth, sequelize } = db;

// const REFRESH_SECRET = process.env.JWT_SECRET_REFRESH;
// const SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
      image = null,
    } = req.body;

    if (!name || !email || !phoneNumber || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields are required" });

    const existing = await User.findOne({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already exists" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email format" });

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });

    const existingPhoneNumber = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber)
      return res.status(400).json({ error: "Phone number already exists" });

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber))
      return res.status(400).json({ error: "Invalid phone number format" });

    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) return res.status(400).json({ error: "Invalid role" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        name,
        email,
        phoneNumber,
        image,
        roleId: userRole.id,
        dailyLimit: 100,
        usedToday: 0,
        lastResetDate: new Date().toISOString().slice(0, 10),
      },
      { transaction: t },
    );

    await UserAuth.create(
      { userId: user.id, provider: "manual", password: hash },
      { transaction: t },
    );

    await t.commit();

    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const auth = await UserAuth.findOne({
      where: { userId: user.id, provider: "manual" },
    });

    const valid = await bcrypt.compare(password, auth.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // res.cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: false,
    //   maxAge: 15 * 60 * 1000,
    //   path: "/",
    // });

    // ✅ REFRESH COOKIE
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture, sub } = ticket.getPayload();

    let user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });

    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) return res.status(400).json({ error: "Invalid role" });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        roleId: userRole.id,
        dailyLimit: 1000,
        usedToday: 0,
        // refreshToken,
        lastResetDate: new Date().toISOString().slice(0, 10),
      });

      await UserAuth.create({
        userId: user.id,
        provider: "google",
        providerUserId: sub,
      });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // res.cookie("access_token", accessToken, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: false,
    //   maxAge: 15 * 60 * 1000,
    //   path: "/",
    // });

    // ✅ REFRESH COOKIE
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refresh_token;
  console.log("Cookie token:", token);

  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_REFRESH);
    console.log("Payload:", payload);

    const user = await User.findByPk(payload.id);
    console.log("User DB token:", user?.refreshToken);

    if (!user || user.refreshToken !== token)
      return res.sendStatus(401);

    const newAccessToken = generateToken(user);
    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.sendStatus(401);
  }
};


export const setPhoneNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { phoneNumber } = req.body;

    await User.update({ phoneNumber }, { where: { id: userId } });
    return res.json({ success: true, message: "Phone number updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// export const logout = async (req, res) => {
//   res.clearCookie("access_token", {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//   });

//   res.json({ success: true, message: "Logout successful" });
// };

// export const logout = async (req, res) => {
//   const token = req.cookies.refresh_token;

//   if (token) {
//     await User.update(
//       { refreshToken: null },
//       { where: { refreshToken: token } },
//     );
//   }

//   res.clearCookie("refresh_token", {
//     path: "/",
//   });

//   return res.sendStatus(200);
// };

export const logout = async (req, res) => {
  try {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};


export const getMe = (req, res) => {
  res.json({ user: req.user });
  console.log("user me", req.user);
};
