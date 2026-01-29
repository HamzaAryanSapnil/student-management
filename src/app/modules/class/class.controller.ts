import catchAsync from "../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { ClassService } from "./class.service";
import { TAuthUser } from "./class.interface";

const createClass = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const newClass = await ClassService.createClass(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Class created successfully.",
    data: newClass,
  });
});

const enrollStudent = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const { id } = req.params;
  const enrolledStudent = await ClassService.enrollStudent(id as string, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student enrolled successfully.",
    data: enrolledStudent,
  });
});

const getClassStudents = catchAsync(async (req, res) => {
  const user = req.user as TAuthUser;
  const { id } = req.params;
  const students = await ClassService.getClassStudents(id as string, user, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Class students retrieved successfully.",
    data: students.data,
    meta: students.meta,
  });
});

export const ClassController = {
  createClass,
  enrollStudent,
  getClassStudents,
};