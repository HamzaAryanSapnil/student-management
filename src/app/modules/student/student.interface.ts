/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type TAuthUser = {
  userId: string;
  email: string;
  role: string;
};

export type IStudentQuery = {
  searchTerm?: string;
  id?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};