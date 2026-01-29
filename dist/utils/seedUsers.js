"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultUsers = exports.seedTeacher = exports.seedAdmin = void 0;
/* eslint-disable no-console */
const prisma_1 = require("../app/shared/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield prisma_1.prisma.user.findFirst({
            where: { role: client_1.UserRole.ADMIN },
        });
        if (existingAdmin) {
            console.log("✅ Admin user already exists");
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash("Admin@123", 12);
        const admin = yield prisma_1.prisma.user.create({
            data: {
                email: "admin@school.com",
                passwordHash: hashedPassword,
                name: "System Administrator",
                role: client_1.UserRole.ADMIN,
                isVerified: true,
            },
        });
        console.log("✅ Admin user created successfully:", {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });
    }
    catch (error) {
        console.error("❌ Error creating admin user:", error);
    }
});
exports.seedAdmin = seedAdmin;
const seedTeacher = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingTeacher = yield prisma_1.prisma.user.findFirst({
            where: {
                role: client_1.UserRole.TEACHER,
                email: "teacher@school.com"
            },
        });
        if (existingTeacher) {
            console.log("✅ Default teacher user already exists");
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash("Teacher@123", 12);
        const teacher = yield prisma_1.prisma.user.create({
            data: {
                email: "teacher@school.com",
                passwordHash: hashedPassword,
                name: "John Smith",
                role: client_1.UserRole.TEACHER,
                isVerified: true,
            },
        });
        console.log("✅ Teacher user created successfully:", {
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
            role: teacher.role,
        });
    }
    catch (error) {
        console.error("❌ Error creating teacher user:", error);
    }
});
exports.seedTeacher = seedTeacher;
const seedDefaultUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🌱 Starting user seeding...");
    yield (0, exports.seedAdmin)();
    yield (0, exports.seedTeacher)();
    console.log("🌱 User seeding completed!");
});
exports.seedDefaultUsers = seedDefaultUsers;
