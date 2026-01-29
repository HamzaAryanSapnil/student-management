import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { StudentService } from "./student.service";
import { TAuthUser } from "./student.interface";

const createStudent = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const student = await StudentService.createStudent(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student created successfully.",
    data: student,
  });
});

const getAllStudents = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const students = await StudentService.getAllStudents(user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Students retrieved successfully.",
    data: students,
    meta: students.meta,
  });
});

const getStudentById = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const { id } = req.params;
  const student = await StudentService.getStudentById(id as string, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student retrieved successfully.",
    data: student,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getStudentById,
};
