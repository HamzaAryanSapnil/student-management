import z from "zod";

const userSignupSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email format." }),

    password: z
      .string()
      .min(1, { message: "Password is required!" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),

    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(100, { message: "Name cannot exceed 100 characters." }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.email({ message: "Invalid email address format." }),
    password: z.string({ error: "Password is required!" }),
  }),
});

export const AuthValidation = {
  userSignupSchema,
  loginValidationSchema,
};
