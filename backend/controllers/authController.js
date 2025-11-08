import bcrypt from "bcrypt";
import db from "../models/index.js";
import { generateToken } from "../utils/token.js";

const { User, Role } = db;

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    if (!name || !email || !phoneNumber || !password || !roleId)
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
      return res.status(400).json({ error: "Password must be at least 8 characters" });

    const existingPhoneNumber = await User.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber)
      return res.status(400).json({ error: "Phone number already exists" });

    const userRole = await Role.findOne({ where: { name: "user" } });
    if (!userRole) return res.status(400).json({ error: "Invalid role" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hash,
      roleId: userRole.id,
      limit: 100,
    });

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

    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
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
