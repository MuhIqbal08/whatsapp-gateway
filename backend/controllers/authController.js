import bcrypt from "bcrypt";
import db from "../models/index.js";
import { generateToken } from "../utils/token.js";
import { OAuth2Client } from "google-auth-library";

const { User, Role, UserAuth } = db;

export const register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, phoneNumber, password, confirmPassword, image=null } = req.body;

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

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(user);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
    });
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
        lastResetDate: new Date().toISOString().slice(0, 10),
      });

      await UserAuth.create({
        userId: user.id,
        provider: "google",
        providerUserId: sub,
      });
    }

    const jwtToken = generateToken(user);

    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
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

export const logout = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ success: true, message: "Logout successful" });
};

export const getMe = async (req, res) => {
  res.json({ user: req.user });
};
