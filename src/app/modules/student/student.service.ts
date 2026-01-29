/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../shared/prisma";
import { IStudentQuery, TAuthUser } from "./student.interface";
import { Prisma, UserRole } from "@prisma/client";
import ApiError from "../../errorHelpers/ApiError";
import httpStatus from "http-status";
import bcrypt from "bcryptjs";
import pick from "../../shared/pick";
import { IPaginationOptions, paginationHelper } from "../../helper/pagination.helper";

const createStudent = async (studentData: any, user: TAuthUser) => {
  const { role } = user;


  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admins and teachers can create students!",
    );
  }


  const existingUser = await prisma.user.findUnique({
    where: { email: studentData.email },
  });

  if (existingUser) {
    throw new ApiError(httpStatus.CONFLICT, "User already exists!");
  }


  const hashedPassword = await bcrypt.hash(studentData.password, 12);


  const result = await prisma.$transaction(async (tx) => {
  
    const newUser = await tx.user.create({
      data: {
        email: studentData.email,
        passwordHash: hashedPassword,
        name: studentData.name,
        role: UserRole.STUDENT,
      },
    });

 
    const newStudent = await tx.student.create({
      data: {
        name: studentData.name,
        age: studentData.age || 18,
        userId: newUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    return newStudent;
  });

  return result;
};

const getAllStudents = async (user: TAuthUser, query: IStudentQuery) => {
  const { role } = user;

  if (role !== UserRole.ADMIN && role !== UserRole.TEACHER) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admins and teachers can view students!",
    );
  }

  const filter = pick<IStudentQuery, keyof IStudentQuery>(query, [
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

  const andConditions: Prisma.StudentWhereInput[] = [];

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
      ],
    });
  }

  const whereConditions: Prisma.StudentWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

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
          role: true,
          profileImage: true,
          createdAt: true,
        },
      },
      class: {
        select: {
          id: true,
          name: true,
          section: true,
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
    },
    data: students,
  };

  return result;
};

const getStudentById = async (id: string, user: TAuthUser) => {
  const { role, userId } = user;

  const student = await prisma.student.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          profileImage: true,
          bio: true,
          location: true,
          createdAt: true,
          updatedAt: true,
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
              email: true,
            },
          },
        },
      },
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found!");
  }

  // Students can only view their own details
  if (role === UserRole.STUDENT && student.userId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You can only view your own details!",
    );
  }

  return student;
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getStudentById,
};
