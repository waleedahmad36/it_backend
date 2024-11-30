import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("mern_lms", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",  // Changed from strict to lax
    secure: process.env.NODE_ENV !== "development" ? true : false,
  });

  return token;
};