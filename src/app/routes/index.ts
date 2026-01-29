import { Router } from "express";
import { StudentRoutes } from "../modules/student/student.routes";
import { ClassRoutes } from "../modules/class/class.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/students",
        route: StudentRoutes
    },
    {
        path: "/classes",
        route: ClassRoutes
    }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)
