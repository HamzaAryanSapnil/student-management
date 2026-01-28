import { Router } from "express";
import { StudentController } from "./student.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "../auth/auth.validation";





const router = Router();

router.post(
  "/create-student",
  auth("ADMIN", "TEACHER"),
  validateRequest(AuthValidation.studentSignupSchema),
);

export const StudentRoutes = router;



