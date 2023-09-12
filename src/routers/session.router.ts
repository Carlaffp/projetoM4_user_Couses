import { Router } from "express";
import { validateBodyMiddleware } from "../middlewares/validate.body.middleware";
import { sessionCreate } from "../schemas/session.schemas";
import { createLoginController } from "../controllers/session.controller";

const sessionRouter: Router = Router();

sessionRouter.post(
  "",
  validateBodyMiddleware(sessionCreate),
  createLoginController
);
export default sessionRouter;
