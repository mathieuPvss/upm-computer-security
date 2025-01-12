import Router from "express";
import { Controller } from "../controllers/Controller.js";

export const indexRouter = Router();

indexRouter.get("/", Controller.index);
indexRouter.get("/articles", Controller.articles);
indexRouter.get("/article", Controller.article);
indexRouter.get("/comments", Controller.comments);
indexRouter.post("/comments", Controller.addCommentWithoutCleaning);
indexRouter.post("/commentsClean", Controller.addCommentWithProtection);
