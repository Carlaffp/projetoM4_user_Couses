import format from "pg-format";
import {
  Users,
  UsersCreate,
  UsersRead,
  UsersResult,
  UsersReturn,
} from "../interfaces/users.interface";
import { client } from "../database";
import { userReadSchema, userReturnSchema } from "../schemas/user.schemas";
import { hash } from "bcryptjs";
import { QueryConfig } from "pg";
import {
  UsersCoursesRead,
  UsersCoursesResult,
  UsersCoursesReturn,
} from "../interfaces/userCourses.interface";
import AppError from "../error";

const createUserService = async (
  payload: UsersCreate
): Promise<UsersReturn> => {
  payload.password = await hash(payload.password, 10);

  const queryFormat: string = format(
    ` INSERT INTO "users" (%I)
  VALUES (%L)
  RETURNING * ;
  `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: UsersResult = await client.query(queryFormat);
  const user: Users = queryResult.rows[0];
  return userReturnSchema.parse(user);
};

const readUserService = async (): Promise<UsersRead> => {
  const queryTemplat: string = `
  SELECT * FROM "users";
  `;
  const queryResult: UsersResult = await client.query(queryTemplat);
  return userReadSchema.parse(queryResult.rows);
};

const readeUserCoursesService = async (
  id: string
): Promise<UsersCoursesRead> => {
  const query = await client.query(
    ` SELECT * FROM "userCourses" WHERE "userId" = $1 AND "active" = true;`,
    [id]
  );

  if (query.rowCount === 0) {
    throw new AppError("No course found", 404);
  }

  const queryTemplat: string = `
  SELECT 
c.id "courseId",
c."name" "courseName",
c.description "courseDescription",
uc.active "userActiveInCourse",
u.id "userId",
u."name" "userName"
FROM "users"AS U
LEFT JOIN "userCourses" uc  
ON u.id = uc."userId" 
LEFT JOIN "courses"AS c
ON c.id  = uc."courseId" 
WHERE u.id = $1;
  `;
  const queryConfig: QueryConfig = {
    text: queryTemplat,
    values: Object.values(id),
  };

  const queryResult: UsersCoursesResult = await client.query(queryConfig);
  return queryResult.rows;
};

export { createUserService, readUserService, readeUserCoursesService };
