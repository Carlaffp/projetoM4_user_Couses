import { NextFunction, Request, Response } from "express";
import AppError from "../error";
import { client } from "../database";
import { Users, UsersResult } from "../interfaces/users.interface";

const userEmailExistMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const queryTemplate: string = `
    SELECT * FROM "users" WHERE "email" = $1;
    `;
  const queryResult: UsersResult = await client.query(queryTemplate, [
    req.body.email,
  ]);
  const foundUserEmail: Users = queryResult.rows[0];
  if (foundUserEmail) {
    throw new AppError("Email already registered", 409);
  }
  return next();
};

export { userEmailExistMiddleware };
