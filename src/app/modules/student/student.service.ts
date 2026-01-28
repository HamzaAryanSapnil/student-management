/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "../../shared/prisma";


const createStudent = async (studentData: any) => {

  const student = await prisma.student.create({
    data: {
      name: studentData.name,
      age: studentData.age,
      userId: studentData.userId
    },
  });

  return student;
};

export const StudentService = { createStudent };
