import z from "zod";

const createClassSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: "Class name is required!" })
      .min(2, { message: "Class name must be at least 2 characters." })
      .max(100, { message: "Class name cannot exceed 100 characters." }),

    section: z
      .string()
      .min(1, { message: "Section is required!" })
      .max(10, { message: "Section cannot exceed 10 characters." }),

    teacherId: z
    .uuid({ message: "Teacher ID must be a valid UUID." }),
  }),
});

const enrollStudentSchema = z.object({
  body: z.object({
    studentId: z
      .number()
      .int({ message: "Student ID must be an integer." })
      .positive({ message: "Student ID must be a positive number." }),
  }),
});

export const ClassValidation = {
  createClassSchema,
  enrollStudentSchema,
};