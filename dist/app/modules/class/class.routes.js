"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRoutes = void 0;
const express_1 = require("express");
const class_controller_1 = require("./class.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const class_validation_1 = require("./class.validation");
const router = (0, express_1.Router)();
router.post("/", (0, auth_1.default)("ADMIN"), (0, validateRequest_1.default)(class_validation_1.ClassValidation.createClassSchema), class_controller_1.ClassController.createClass);
router.post("/:id/enroll", (0, auth_1.default)("ADMIN", "TEACHER"), (0, validateRequest_1.default)(class_validation_1.ClassValidation.enrollStudentSchema), class_controller_1.ClassController.enrollStudent);
router.get("/:id/students", (0, auth_1.default)("ADMIN", "TEACHER"), class_controller_1.ClassController.getClassStudents);
exports.ClassRoutes = router;
