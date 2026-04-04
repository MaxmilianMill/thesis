import { Router } from "express";
import type { ModuleRoute } from "../types/module-route.js";
import authRouter from "./auth/auth-routes.js";
import setupRouter from "./setup/setup-routes.js";
import chatRouter from "./chat/index.js";

const v1Router = Router();

const moduleRoutes: ModuleRoute[] = [
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/setup",
        route: setupRouter
    },
    {
        path: "/chat",
        route: chatRouter
    }
];

moduleRoutes.forEach((moduleRoute) => {
    v1Router.use(moduleRoute.path, moduleRoute.route);
});

export default v1Router;