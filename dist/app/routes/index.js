"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const student_routes_1 = require("../modules/student/student.routes");
const class_routes_1 = require("../modules/class/class.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/students",
        route: student_routes_1.StudentRoutes
    },
    {
        path: "/classes",
        route: class_routes_1.ClassRoutes
    }
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
// router.use("/user", UserRoutes)
// router.use("/tour", TourRoutes)
// router.use("/division", DivisionRoutes)
// router.use("/booking", BookingRoutes)
// router.use("/user", UserRoutes)
