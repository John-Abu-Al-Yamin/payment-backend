import User from "../models/User.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validations/user.validation.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { username, phone, password, confirmPassword } = req.body;

    const foundUser = await User.findOne({ phone }).exec();

    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      phone,
      password: hashedPassword,
    });

    const accessToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.REFRSH_JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      phone: user.phone,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { phone, password } = req.body;

    const foundUser = await User.findOne({ phone }).exec();

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, foundUser.password);

    if (!matchPassword) {
      return res.status(401).json({ message: "Invalid password or phone" });
    }

    const accessToken = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.REFRSH_JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = {
      _id: foundUser._id,
      username: foundUser.username,
      phone: foundUser.phone,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
      accessToken,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRSH_JWT_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" }); //Forbidden
      const foundUser = await User.findById(decoded.UserInfo.id).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        { UserInfo: { id: foundUser._id } },
        process.env.REFRSH_JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.json({ accessToken });
    }
  );
};

export const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content 
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
