import { Router } from "express";
import taskListRouter from "./task-list-route.js";
import importedChatRouter from "./chat-router.js";
import tutorRouter from "./tutor-router.js";
import { authHandler } from "../../middlewares/auth-handler.js";

const chatRouter = Router();

chatRouter.use(authHandler);

chatRouter.use("/tasks", taskListRouter);
chatRouter.use("/tutor", tutorRouter);
chatRouter.use("/", importedChatRouter);

export default chatRouter;