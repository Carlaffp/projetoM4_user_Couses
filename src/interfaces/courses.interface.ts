import { QueryResult } from "pg";
import {
  courseCreateSchema,
  courseReadSchema,
  courseReturnSchema,
  courseSchema,
  courseUpdateSchema,
} from "../schemas/courses.schema";
import { z } from "zod";

type Courses = z.infer<typeof courseSchema>;
type CoursesCreate = z.infer<typeof courseCreateSchema>;
type CoursesUpdate = z.infer<typeof courseUpdateSchema>;
type CousesRead = z.infer<typeof courseReadSchema>;
type CoursesReturn = z.infer<typeof courseReturnSchema>;
type CoursesResult = QueryResult<Courses>;

export {
  Courses,
  CoursesCreate,
  CoursesResult,
  CoursesUpdate,
  CousesRead,
  CoursesReturn,
};
