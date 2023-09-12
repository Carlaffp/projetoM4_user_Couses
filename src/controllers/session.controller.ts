import { Request, Response } from "express";
import { SessionReturn } from "../interfaces/session.interface";
import { createLoginService } from "../services/session.service";

const createLoginController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token: SessionReturn = await createLoginService(req.body);
  return res.status(200).json(token);
};

export { createLoginController };
