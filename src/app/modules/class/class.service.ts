/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../shared/prisma";
import { IClassQuery, TAuthUser, ICreateClass, IEnrollStudent } from "./class.interface";
import { Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errorHelpers/ApiError";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { IPaginationOptions, paginationHelper } from "../../helper/pagination.helper";

const createClass = async (classData: ICreateClass, user: TAuthUser) => {
  const { role } = user;

  if (role !== UserRole.ADMIN) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admins can create classes!",
    );
  }

 const teacher = await prisma.user.findUnique({
    where: { id: classData.teacherId },
  });

  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found!");
  }

  if (teacher.role !== UserRole.TEACHER) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Selected user is not a teacher!",
    );
  }

 const existingClass = await prisma.class.findFirst({
    where: {
      name: classData.name,
      section: classData.section,
    },
  });

  if (existingClass) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Class with this name and section already exists!",
    );
  }

  const newClass = await prisma.class.create({
    data: {
      name: classData.name,
      section: classData.section,
      teacherId: classData.teacherId,
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  });

  return newClass;
};

const enrollStudent = async (classId: string, enrollData: IEnrollStudent, user: TAuthUser) => {
  const { role } = user;

  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admins and teachers can enroll students!",
    );
  }

   const classExists = await prisma.class.findUnique({
    where: { id: Number(classId) },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!classExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found!");
  }

  if (role === UserRole.TEACHER && classExists.teacherId !== user.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Teachers can only enroll students in their own classes!",
    );
  }

 const student = await prisma.student.findUnique({
    where: { id: enrollData.studentId },
    include: {
      class: {
        select: {
          id: true,
          name: true,
          section: true,
        },
      },
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found!");
  }

if (student.classId) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Student is already enrolled in ${student.class?.name} - ${student.class?.section}!`,
    );
  }

  const updatedStudent = await prisma.student.update({
    where: { id: enrollData.studentId },
    data: { classId: Number(classId) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
          section: true,
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return updatedStudent;
};

const getClassStudents = async (classId: string, user: TAuthUser, query: IClassQuery) => {
  const { role } = user;

  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admins and teachers can view class students!",
    );
  }

  const classExists = await prisma.class.findUnique({
    where: { id: Number(classId) },
    select: {
      id: true,
      name: true,
      section: true,
      teacherId: true,
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!classExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Class not found!");
  }

  if (role === UserRole.TEACHER && classExists.teacherId !== user.userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Teachers can only view students from their own classes!",
    );
  }

  const filter = pick<IClassQuery, keyof IClassQuery>(query, [
    "searchTerm",
  ]);

  const options: IPaginationOptions = {
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    sortBy: query.sortBy ?? "id",
    sortOrder: query.sortOrder ?? "desc",
  };

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.StudentWhereInput[] = [
    { classId: Number(classId) },
  ];

  const { searchTerm } = filter;

  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.StudentWhereInput = { AND: andConditions };

  const validSortFields = ["id", "name", "age"];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : "id";

  const students = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [finalSortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  const total = await prisma.student.count({
    where: whereConditions,
  });

  const result = {
    meta: {
      total,
      page,
      limit,
      classInfo: {
        id: classExists.id,
        name: classExists.name,
        section: classExists.section,
        teacher: classExists.teacher,
      },
    },
    data: students,
  };

  return result;
};

export const ClassService = {
  createClass,
  enrollStudent,
  getClassStudents,
};