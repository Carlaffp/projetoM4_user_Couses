import { Request, Response } from "express";
import {
  createUserService,
  readUserService,
  readeUserCoursesService,
} from "../services/user.service";
import { UsersRead, UsersReturn } from "../interfaces/users.interface";

const createUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const create: UsersReturn = await createUserService(req.body);

  return res.status(201).json(create);
};

const readUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const read: UsersRead = await readUserService();
  return res.status(200).json(read);
};

const readUserCoursesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const read = await readeUserCoursesService(req.params.id);
  return res.status(200).json(read);
};

export { createUserController, readUserController, readUserCoursesController };
