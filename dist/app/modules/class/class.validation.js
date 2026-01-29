"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createClassSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string()
            .min(1, { message: "Class name is required!" })
            .min(2, { message: "Class name must be at least 2 characters." })
            .max(100, { message: "Class name cannot exceed 100 characters." }),
        section: zod_1.default
            .string()
            .min(1, { message: "Section is required!" })
            .max(10, { message: "Section cannot exceed 10 characters." }),
        teacherId: zod_1.default
            .uuid({ message: "Teacher ID must be a valid UUID." }),
    }),
});
const enrollStudentSchema = zod_1.default.object({
    body: zod_1.default.object({
        studentId: zod_1.default
            .number()
            .int({ message: "Student ID must be an integer." })
            .positive({ message: "Student ID must be a positive number." }),
    }),
});
exports.ClassValidation = {
    createClassSchema,
    enrollStudentSchema,
};
