/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type TAuthUser = {
  userId: string;
  email: string;
  role: string;
};

export type IClassQuery = {
  searchTerm?: string;
  teacherId?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ICreateClass = {
  name: string;
  section: string;
  teacherId: string;
};

export type IEnrollStudent = {
  studentId: number;
};