import format from "pg-format";
import { client } from "../database";
import {
  Courses,
  CoursesCreate,
  CoursesResult,
  CousesRead,
} from "../interfaces/courses.interface";
import { courseReadSchema } from "../schemas/courses.schema";
import {
  UsersCourses,
  UsersCoursesCreate,
  UsersCoursesRead,
} from "../interfaces/userCourses.interface";
import { QueryConfig, QueryResult } from "pg";
import AppError from "../error";

const createCoursesService = async (
  payload: CoursesCreate
): Promise<Courses> => {
  const queryFormat: string = format(
    ` INSERT INTO "courses" (%I)
  VALUES (%L)
  RETURNING * ;
  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: CoursesResult = await client.query(queryFormat);
  return queryResult.rows[0];
};

const readCoursesService = async (): Promise<CousesRead> => {
  const queryTemplat: string = `
    SELECT * FROM "courses";
    `;
  const queryResult: CoursesResult = await client.query(queryTemplat);
  return courseReadSchema.parse(queryResult.rows);
};

const enrollUserToCourseService = async (
  courseId: string,
  userId: string
): Promise<string> => {
  const queryCourse: QueryResult = await client.query(
    `
    SELECT * FROM "courses" WHERE "id" = $1 ;`,
    [courseId]
  );

  if (queryCourse.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }

  const queryUser: QueryResult = await client.query(
    `
    SELECT * FROM "users" WHERE "id" = $1 ;`,
    [userId]
  );

  if (queryUser.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }

  await client.query(
    `INSERT INTO "userCourses" ("courseId", "userId") VALUES ($1, $2);`,
    [courseId, userId]
  );
  return "User successfully vinculed to course";
};

const unsubscribeUserService = async (
  courseId: string,
  userId: string
): Promise<void> => {
  const query = await client.query(
    `
    SELECT * FROM "userCourses" WHERE "courseId" = $1 AND "userId" = $2;`,
    [courseId, userId]
  );

  if (query.rowCount === 0) {
    throw new AppError("User/course not found", 404);
  }
  await client.query(
    `
    UPDATE "userCourses" SET "active" = false WHERE "courseId"=$1 AND "userId"=$2;`,
    [courseId, userId]
  );
};

const readeUsersByCourseService = async (
  id: string
): Promise<UsersCoursesRead> => {
  const queryTemplat: string = `
    SELECT DISTINCT 
    u.id "userId",
    u."name" "userName",
    c.id "courseId",
    c."name" "courseName",
    c.description "courseDescription",
    uc.active "userActiveInCourse"
    FROM "courses" AS c 
    LEFT JOIN "userCourses" uc  
    ON c.id = uc."courseId" 
    LEFT JOIN "users" AS u
    ON uc."userId" = u.id 
    WHERE c."id" = $1 AND uc."active" = true;`;

  const queryConfig: QueryConfig = {
    text: queryTemplat,
    values: Object.values(id),
  };

  const queryResult: QueryResult = await client.query(queryConfig);
  return queryResult.rows;
};

export {
  createCoursesService,
  readCoursesService,
  enrollUserToCourseService,
  unsubscribeUserService,
  readeUsersByCourseService,
};
