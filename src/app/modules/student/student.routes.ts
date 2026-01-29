import { Router } from "express";
import { StudentController } from "./student.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidation } from "./student.validation";

const router = Router();




router.get("/", auth("ADMIN", "TEACHER"), StudentController.getAllStudents);


router.get("/:id", auth("ADMIN", "TEACHER", "STUDENT"), StudentController.getStudentById);


router.post(
  "/",
  auth("ADMIN"),
  validateRequest(StudentValidation.createStudentSchema),
  StudentController.createStudent,
);

export const StudentRoutes = router;



