"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = require("express");
const student_controller_1 = require("./student.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_validation_1 = require("./student.validation");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)("ADMIN", "TEACHER"), student_controller_1.StudentController.getAllStudents);
router.get("/:id", (0, auth_1.default)("ADMIN", "TEACHER", "STUDENT"), student_controller_1.StudentController.getStudentById);
router.post("/", (0, auth_1.default)("ADMIN"), (0, validateRequest_1.default)(student_validation_1.StudentValidation.createStudentSchema), student_controller_1.StudentController.createStudent);
exports.StudentRoutes = router;
