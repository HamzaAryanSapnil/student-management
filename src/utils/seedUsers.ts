/* eslint-disable no-console */
import { prisma } from "../app/shared/prisma";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export const seedAdmin = async () => {
  try {
    
    const existingAdmin = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

  
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    
    const admin = await prisma.user.create({
      data: {
        email: "admin@school.com",
        passwordHash: hashedPassword,
        name: "System Administrator",
        role: UserRole.ADMIN,
        isVerified: true,
      },
    });

    console.log("✅ Admin user created successfully:", {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

export const seedTeacher = async () => {
  try {
  
    const existingTeacher = await prisma.user.findFirst({
      where: { 
        role: UserRole.TEACHER,
        email: "teacher@school.com"
      },
    });

    if (existingTeacher) {
      console.log("✅ Default teacher user already exists");
      return;
    }

   
    const hashedPassword = await bcrypt.hash("Teacher@123", 12);
    
    const teacher = await prisma.user.create({
      data: {
        email: "teacher@school.com",
        passwordHash: hashedPassword,
        name: "John Smith",
        role: UserRole.TEACHER,
        isVerified: true,
      },
    });

    console.log("✅ Teacher user created successfully:", {
      id: teacher.id,
      email: teacher.email,
      name: teacher.name,
      role: teacher.role,
    });
  } catch (error) {
    console.error("❌ Error creating teacher user:", error);
  }
};

export const seedDefaultUsers = async () => {
  console.log("🌱 Starting user seeding...");
  await seedAdmin();
  await seedTeacher();
  console.log("🌱 User seeding completed!");
};