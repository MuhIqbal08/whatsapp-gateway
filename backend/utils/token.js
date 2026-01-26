import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

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

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
