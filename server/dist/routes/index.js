import { Router } from "express";
import authRouter from "./auth/authRoutes.js";
const v1Router = Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: authRouter
    }
];
moduleRoutes.forEach((moduleRoute) => {
    v1Router.use(moduleRoute.path, moduleRoute.route);
});
export default v1Router;
//# sourceMappingURL=index.js.map