import z from "zod";

const createStudentSchema = z.object({
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

    age: z
      .number()
      .int({ message: "Age must be an integer." })
      .min(5, { message: "Age must be at least 5." })
      .max(100, { message: "Age cannot exceed 100." })
      .optional(),
  }),
});

export const StudentValidation = {
  createStudentSchema,
};
