import { Router } from "express";
import taskListRouter from "./task-list-route.js";

const chatRouter = Router();

chatRouter.use("/tasks", taskListRouter);

export default chatRouter;