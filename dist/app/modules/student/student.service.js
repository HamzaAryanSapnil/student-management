"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.StudentService = void 0;
const prisma_1 = require("../../shared/prisma");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errorHelpers/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_helper_1 = require("../../helper/pagination.helper");
const createStudent = (studentData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = user;
    if (role !== client_1.UserRole.ADMIN && role !== client_1.UserRole.TEACHER) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only admins and teachers can create students!");
    }
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { email: studentData.email },
    });
    if (existingUser) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "User already exists!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(studentData.password, 12);
    const result = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield tx.user.create({
            data: {
                email: studentData.email,
                passwordHash: hashedPassword,
                name: studentData.name,
                role: client_1.UserRole.STUDENT,
            },
        });
        const newStudent = yield tx.student.create({
            data: {
                name: studentData.name,
                age: studentData.age || 18,
                userId: newUser.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
        });
        return newStudent;
    }));
    return result;
});
const getAllStudents = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { role } = user;
    if (role !== client_1.UserRole.ADMIN && role !== client_1.UserRole.TEACHER) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only admins and teachers can view students!");
    }
    const filter = (0, pick_1.default)(query, [
        "searchTerm",
    ]);
    const options = {
        page: (_a = query.page) !== null && _a !== void 0 ? _a : 1,
        limit: (_b = query.limit) !== null && _b !== void 0 ? _b : 10,
        sortBy: (_c = query.sortBy) !== null && _c !== void 0 ? _c : "id",
        sortOrder: (_d = query.sortOrder) !== null && _d !== void 0 ? _d : "desc",
    };
    const { page, limit, skip, sortBy, sortOrder } = pagination_helper_1.paginationHelper.calculatePagination(options);
    const andConditions = [];
    const { searchTerm } = filter;
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const validSortFields = ["id", "name", "age"];
    const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "id";
    const students = yield prisma_1.prisma.student.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [finalSortBy]: sortOrder,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    profileImage: true,
                    createdAt: true,
                },
            },
            class: {
                select: {
                    id: true,
                    name: true,
                    section: true,
                },
            },
        },
    });
    const total = yield prisma_1.prisma.student.count({
        where: whereConditions,
    });
    const result = {
        meta: {
            total,
            page,
            limit,
        },
        data: students,
    };
    return result;
});
const getStudentById = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, userId } = user;
    const student = yield prisma_1.prisma.student.findUnique({
        where: { id: Number(id) },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    profileImage: true,
                    bio: true,
                    location: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            class: {
                select: {
                    id: true,
                    name: true,
                    section: true,
                    teacher: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found!");
    }
    // Students can only view their own details
    if (role === client_1.UserRole.STUDENT && student.userId !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "You can only view your own details!");
    }
    return student;
});
exports.StudentService = {
    createStudent,
    getAllStudents,
    getStudentById,
};
