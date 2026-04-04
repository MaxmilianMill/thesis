import { Router } from "express";
import taskListRouter from "./task-list-route.js";
import importedChatRouter from "./chat-router.js";

const chatRouter = Router();

chatRouter.use("/tasks", taskListRouter);
chatRouter.use("/", importedChatRouter);

export default chatRouter;