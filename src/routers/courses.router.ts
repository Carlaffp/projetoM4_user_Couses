import { Router } from "express";
import { validateBodyMiddleware } from "../middlewares/validate.body.middleware";
import { courseCreateSchema } from "../schemas/courses.schema";
import {
  createCoursesController,
  enrollUserToCourseController,
  readCourseController,
  readeUserByCourseController,
  unsubscribeUserController,
} from "../controllers/courses.controller";
import { validateTokenMiddleware } from "../middlewares/validateToken.middleware";
import { verifyUserPermitionMiddleware } from "../middlewares/verifyUserPermition.middleware";

const coursesRouter: Router = Router();

coursesRouter.post(
  "",
  validateBodyMiddleware(courseCreateSchema),
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  createCoursesController
);
coursesRouter.get("", readCourseController);
coursesRouter.post(
  "/:courseId/users/:userId",
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  enrollUserToCourseController
);
coursesRouter.delete(
  "/:courseId/users/:userId",
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  unsubscribeUserController
);
coursesRouter.get(
  "/:id/users",
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  readeUserByCourseController
);
export default coursesRouter;
