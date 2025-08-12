import bcrypt from "bcrypt";
import User from "../models/User.js";
import { changePasswordSchema, updateUserSchema } from "../validations/user.validation.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Error getting users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error getting user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    // validation
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    // منع تعديل الباسورد من هنا
    if (req.body.password) {
      return res.status(400).json({ message: "Use change password endpoint" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      result.data, 
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};


export const changePassword = async (req, res) => {
  try {
    // validate body
    const result = changePasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.issues });
    }

    const { oldPassword, newPassword } = result.data;

    // find user
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "كلمة السر القديمة غير صحيحة" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة السر بنجاح" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};
