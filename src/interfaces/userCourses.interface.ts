import { QueryResult } from "pg";
import { z } from "zod";
import {
  userCoursesCreateSchema,
  userCoursesReadSchema,
  userCoursesReturnSchema,
  userCoursesSchema,
  userCoursesUpdateSchema,
} from "../schemas/userCourses.schema";

type UsersCourses = z.infer<typeof userCoursesSchema>;
type UsersCoursesCreate = z.infer<typeof userCoursesCreateSchema>;
type UsersCoursesUpdate = z.infer<typeof userCoursesUpdateSchema>;
type UsersCoursesRead = z.infer<typeof userCoursesReadSchema>;
type UsersCoursesReturn = z.infer<typeof userCoursesReturnSchema>;
type UsersCoursesResult = QueryResult<UsersCourses>;

export {
  UsersCourses,
  UsersCoursesCreate,
  UsersCoursesUpdate,
  UsersCoursesRead,
  UsersCoursesReturn,
  UsersCoursesResult,
};
