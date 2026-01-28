import { Router } from "express";
import { StudentRoutes } from "../modules/student/student.routes";


export const router = Router();

const moduleRoutes = [
    {
        path: "/students",
        route: StudentRoutes
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
