import "express-async-errors";
import "dotenv/config";
import express, { Application, json } from "express";
import usersRouter from "./routers/user.router";
import handleMiddleware from "./middlewares/handle.middleware";
import coursesRouter from "./routers/courses.router";
import sessionRouter from "./routers/session.router";

const app: Application = express();
app.use(json());

app.use("/users", usersRouter);
app.use("/login", sessionRouter);
app.use("/courses", coursesRouter);

app.use(handleMiddleware.erro);

export default app;
