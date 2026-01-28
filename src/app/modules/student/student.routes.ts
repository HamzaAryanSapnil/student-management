import { Router } from "express";
import { StudentController } from "./student.controller";





const router = Router();

router.post(
  "/",
//   protect,
//   authorize("admin"),
//   validateRequest(StudentValidation.createStudent),
  StudentController.createStudent,
);

export const StudentRoutes = router;



