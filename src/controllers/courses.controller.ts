import { Request, Response } from "express";
import {
  createCoursesService,
  enrollUserToCourseService,
  readCoursesService,
  readeUsersByCourseService,
  unsubscribeUserService,
} from "../services/courses.service";
import { CousesRead } from "../interfaces/courses.interface";
import {
  UsersCourses,
  UsersCoursesCreate,
} from "../interfaces/userCourses.interface";

const createCoursesController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const create = await createCoursesService(req.body);

  return res.status(201).json(create);
};

const readCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const read: CousesRead = await readCoursesService();
  return res.status(200).json(read);
};

const enrollUserToCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const message: string = await enrollUserToCourseService(
    req.params.courseId,
    req.params.userId
  );
  return res.status(201).json({ message });
};

const unsubscribeUserController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  await unsubscribeUserService(req.params.courseId, req.params.userId);
  return res.status(204).json();
};

const readeUserByCourseController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const read = await readeUsersByCourseService(req.params.id);
  return res.status(200).json(read);
};

export {
  createCoursesController,
  readCourseController,
  enrollUserToCourseController,
  unsubscribeUserController,
  readeUserByCourseController,
};
