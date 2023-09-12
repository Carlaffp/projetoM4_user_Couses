import { sign } from "jsonwebtoken";
import { client } from "../database";
import AppError from "../error";
import "dotenv/config";
import { SessionCreat, SessionReturn } from "../interfaces/session.interface";
import { Users, UsersResult } from "../interfaces/users.interface";
import { compare } from "bcryptjs";

const createLoginService = async (
  payload: SessionCreat
): Promise<SessionReturn> => {
  const query: UsersResult = await client.query(
    `SELECT * FROM "users" WHERE "email" =$1;`,
    [payload.email]
  );

  if (query.rowCount === 0) {
    throw new AppError("Wrong email/password", 401);
  }

  const user: Users = query.rows[0];
  const samePassword: boolean = await compare(payload.password, user.password);

  if (!samePassword) {
    throw new AppError("Wrong email/password", 401);
  }

  const token = sign(
    { name: user.name, admin: user.admin },
    process.env.SECRET_KEY!,
    { subject: user.id.toString(), expiresIn: process.env.EXPIRES_IN! }
  );

  return { token };
};

export { createLoginService };
