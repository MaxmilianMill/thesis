import { Router } from "express";
import type { ModuleRoute } from "./types/module.route.js";
import authRouter from "./auth/authRoutes.js";

const v1Router = Router();

const moduleRoutes: ModuleRoute[] = [
    {
        path: "/auth",
        route: authRouter
    }
];

moduleRoutes.forEach((moduleRoute) => {
    v1Router.use(moduleRoute.path, moduleRoute.route);
});

export default v1Router;