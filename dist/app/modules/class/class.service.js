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
exports.ClassService = void 0;
const prisma_1 = require("../../shared/prisma");
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../errorHelpers/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../shared/pick"));
const pagination_helper_1 = require("../../helper/pagination.helper");
const createClass = (classData, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { role } = user;
    if (role !== client_1.UserRole.ADMIN) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only admins can create classes!");
    }
    const teacher = yield prisma_1.prisma.user.findUnique({
        where: { id: classData.teacherId },
    });
    if (!teacher) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found!");
    }
    if (teacher.role !== client_1.UserRole.TEACHER) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Selected user is not a teacher!");
    }
    const existingClass = yield prisma_1.prisma.class.findFirst({
        where: {
            name: classData.name,
            section: classData.section,
        },
    });
    if (existingClass) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Class with this name and section already exists!");
    }
    const newClass = yield prisma_1.prisma.class.create({
        data: {
            name: classData.name,
            section: classData.section,
            teacherId: classData.teacherId,
        },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            _count: {
                select: {
                    students: true,
                },
            },
        },
    });
    return newClass;
});
const enrollStudent = (classId, enrollData, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { role } = user;
    if (role !== client_1.UserRole.ADMIN && role !== client_1.UserRole.TEACHER) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only admins and teachers can enroll students!");
    }
    const classExists = yield prisma_1.prisma.class.findUnique({
        where: { id: Number(classId) },
        include: {
            teacher: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!classExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Class not found!");
    }
    if (role === client_1.UserRole.TEACHER && classExists.teacherId !== user.userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Teachers can only enroll students in their own classes!");
    }
    const student = yield prisma_1.prisma.student.findUnique({
        where: { id: enrollData.studentId },
        include: {
            class: {
                select: {
                    id: true,
                    name: true,
                    section: true,
                },
            },
        },
    });
    if (!student) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found!");
    }
    if (student.classId) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, `Student is already enrolled in ${(_a = student.class) === null || _a === void 0 ? void 0 : _a.name} - ${(_b = student.class) === null || _b === void 0 ? void 0 : _b.section}!`);
    }
    const updatedStudent = yield prisma_1.prisma.student.update({
        where: { id: enrollData.studentId },
        data: { classId: Number(classId) },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
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
                        },
                    },
                },
            },
        },
    });
    return updatedStudent;
});
const getClassStudents = (classId, user, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { role } = user;
    if (role !== client_1.UserRole.ADMIN && role !== client_1.UserRole.TEACHER) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Only admins and teachers can view class students!");
    }
    const classExists = yield prisma_1.prisma.class.findUnique({
        where: { id: Number(classId) },
        select: {
            id: true,
            name: true,
            section: true,
            teacherId: true,
            teacher: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!classExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Class not found!");
    }
    if (role === client_1.UserRole.TEACHER && classExists.teacherId !== user.userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Teachers can only view students from their own classes!");
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
    const andConditions = [
        { classId: Number(classId) },
    ];
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
                {
                    user: {
                        email: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    const whereConditions = { AND: andConditions };
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
                    profileImage: true,
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
            classInfo: {
                id: classExists.id,
                name: classExists.name,
                section: classExists.section,
                teacher: classExists.teacher,
            },
        },
        data: students,
    };
    return result;
});
exports.ClassService = {
    createClass,
    enrollStudent,
    getClassStudents,
};
