import { Router } from "express";
import { validateBodyMiddleware } from "../middlewares/validate.body.middleware";
import {
  createUserController,
  readUserController,
  readUserCoursesController,
} from "../controllers/user.controller";
import { userCreateSchema } from "../schemas/user.schemas";
import { userEmailExistMiddleware } from "../middlewares/user.middleware";
import { validateTokenMiddleware } from "../middlewares/validateToken.middleware";
import { verifyUserPermitionMiddleware } from "../middlewares/verifyUserPermition.middleware";

const usersRouter: Router = Router();

usersRouter.post(
  "",
  validateBodyMiddleware(userCreateSchema),
  userEmailExistMiddleware,
  createUserController
);
usersRouter.get(
  "",
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  readUserController
);
usersRouter.get(
  "/:id/courses",
  validateTokenMiddleware,
  verifyUserPermitionMiddleware,
  readUserCoursesController
);

export default usersRouter;
