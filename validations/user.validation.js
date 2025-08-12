import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3, "الاسم لازم يكون على الأقل 3 حروف"),
    phone: z
      .string()
      .regex(
        /^\+[1-9]\d{9,14}$/,
        "رقم الموبايل غير صحيح، لازم يكون بصيغة دولية ويبدأ بـ +"
      ),
    password: z.string().min(8, "كلمة السر لازم تكون على الأقل 8 حروف"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمة السر وتأكيدها مش متطابقين",
  });

export const loginSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{9,14}$/,
      "رقم الموبايل غير صحيح، لازم يكون بصيغة دولية ويبدأ بـ +"
    ),
  password: z.string().min(8, "كلمة السر لازم تكون على الأقل 8 حروف"),
});

export const updateUserSchema = z.object({
  username: z.string().min(3, "الاسم لازم يكون على الأقل 3 حروف").optional(),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{9,14}$/,
      "رقم الموبايل غير صحيح، لازم يكون بصيغة دولية ويبدأ بـ +"
    )
    .optional(),
});


export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8, "كلمة السر القديمة لازم تكون على الأقل 8 حروف"),
    newPassword: z.string().min(8, "كلمة السر الجديدة لازم تكون على الأقل 8 حروف"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "كلمة السر الجديدة وتأكيدها مش متطابقين",
  });
