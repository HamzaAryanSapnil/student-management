import { Router } from "express";
import { ClassController } from "./class.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ClassValidation } from "./class.validation";

const router = Router();


router.post(
  "/",
  auth("ADMIN"),
  validateRequest(ClassValidation.createClassSchema),
  ClassController.createClass,
);

router.post(
  "/:id/enroll",
  auth("ADMIN", "TEACHER"),
  validateRequest(ClassValidation.enrollStudentSchema),
  ClassController.enrollStudent,
);

router.get(
  "/:id/students",
  auth("ADMIN", "TEACHER"),
  ClassController.getClassStudents,
);

export const ClassRoutes = router;