import { Router } from "express";
import taskListRouter from "./task-list-route.js";
import importedChatRouter from "./chat-router.js";
import tutorRouter from "./tutor-router.js";

const chatRouter = Router();

chatRouter.use("/tasks", taskListRouter);
chatRouter.use("/tutor", tutorRouter);
chatRouter.use("/", importedChatRouter);

export default chatRouter;