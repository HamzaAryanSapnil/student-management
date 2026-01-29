import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();


router.post(
  "/signup",
  validateRequest(AuthValidation.signupSchema),
  AuthController.signup,
);


router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login,
);

router.post("/refresh-token", AuthController.refreshToken);


router.get("/me", auth("ADMIN", "TEACHER", "STUDENT"), AuthController.getMe);

router.post("/logout", AuthController.logout);

export const AuthRoutes = router;