

import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { StudentService } from "./student.service";

const createStudent = catchAsync(async (req, res) => {
  const student = await StudentService.createStudent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student created successfully.",
    data: student,
  });
});


export const StudentController = { createStudent };