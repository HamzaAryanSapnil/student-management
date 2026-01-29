"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createStudentSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email({ message: "Invalid email format." }),
        password: zod_1.default
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
        name: zod_1.default
            .string()
            .min(2, { message: "Name must be at least 2 characters." })
            .max(100, { message: "Name cannot exceed 100 characters." }),
        age: zod_1.default
            .number()
            .int({ message: "Age must be an integer." })
            .min(5, { message: "Age must be at least 5." })
            .max(100, { message: "Age cannot exceed 100." })
            .optional(),
    }),
});
exports.StudentValidation = {
    createStudentSchema,
};
