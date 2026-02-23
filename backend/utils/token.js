import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.JWT_SECRET;
const SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      roleId: user.roleId,
      email: user.email,
    },
    SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    SECRET_REFRESH,
    { expiresIn: "7d" }
  );
};
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

export const verifyRefresh = (token) =>
  jwt.verify(token, SECRET_REFRESH);