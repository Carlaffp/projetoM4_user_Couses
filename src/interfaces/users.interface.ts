import { QueryResult } from "pg";
import { z } from "zod";
import {
  userCreateSchema,
  userReadSchema,
  userReturnSchema,
  userSchema,
  userUpdateSchema,
} from "../schemas/user.schemas";

type Users = z.infer<typeof userSchema>;
type UsersCreate = z.infer<typeof userCreateSchema>;
type UsersUpdate = z.infer<typeof userUpdateSchema>;
type UsersRead = z.infer<typeof userReadSchema>;
type UsersReturn = z.infer<typeof userReturnSchema>;
type UsersResult = QueryResult<Users>;

export { Users, UsersCreate, UsersResult, UsersUpdate, UsersRead, UsersReturn };
