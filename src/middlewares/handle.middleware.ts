import { NextFunction, Request, Response } from "express";
import AppError from "../error";
import { z } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";
import { json } from "stream/consumers";

const erro = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof z.ZodError) {
    return res.status(400).json(err.flatten().fieldErrors);
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ message: err.message });
  }
  console.log(err);
  return res.status(500).json({ message: "Internal Server Error" });
};
export default { erro };
