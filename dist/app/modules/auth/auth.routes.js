"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/signup", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.signupSchema), auth_controller_1.AuthController.signup);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthController.login);
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken);
router.get("/me", (0, auth_1.default)("ADMIN", "TEACHER", "STUDENT"), auth_controller_1.AuthController.getMe);
router.post("/logout", auth_controller_1.AuthController.logout);
exports.AuthRoutes = router;
